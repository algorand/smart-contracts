import os
from inspect import *
from typing import Callable
from Cryptodome.Hash import SHA512

from pyteal import *



@Subroutine(TealType.uint64)
def wrap_return_bytes(b: TealType.bytes)->Expr:
    return Seq(
        Log(
            Concat(
                Bytes("base16", "0x151f7c75"), #Literally hash('return')[:4] 
                b
            )
        ),
        Int(1)
    )

@Subroutine(TealType.uint64)
def wrap_return_int(b: TealType.uint64)->Expr:
    return Seq(
        Log(
            Concat(
                Bytes("base16", "0x151f7c75"), #Literally hash('return')[:4] 
                Itob(b) 
            )
        ),
        Int(1)
    )

@Subroutine(TealType.uint64)
def add(a: TealType.uint64, b: TealType.uint64)->Expr:
    return a+b

@Subroutine(TealType.uint64)
def sub(a: TealType.uint64, b: TealType.uint64)->Expr:
    return a-b

@Subroutine(TealType.uint64)
def mul(a: TealType.uint64, b: TealType.uint64)->Expr:
    return a*b

@Subroutine(TealType.uint64)
def div(a: TealType.uint64, b: TealType.uint64)->Expr:
    return a/b

@Subroutine(TealType.uint64)
def mod(a: TealType.uint64, b: TealType.uint64)->Expr:
    return a%b

@Subroutine(TealType.bytes)
def qrem(a: TealType.uint64, b: TealType.uint64)->Expr:
    return Concat(Itob(div(a,b)), Itob(mod(a,b)))

@Subroutine(TealType.bytes)
def reverse(a: TealType.bytes)->Expr:
    idx = ScratchVar()
    buff = ScratchVar()

    init = idx.store(ExtractUint16(a, Int(0)) + Int(1))
    cond = idx.load() >= Int(2) 
    iter = idx.store(idx.load() - Int(1))
    return Seq(
        buff.store(Bytes("")),
        For(init, cond, iter).Do(
            buff.store(
                Concat(buff.load(), Extract(a, idx.load(), Int(1)))
            )
        ),
        prepend_length(buff.load())
    )

@Subroutine(TealType.bytes)
def prepend_length(b: TealType.bytes)->Expr:
    return Concat(Extract(Itob(Len(b)), Int(6), Int(2)), b)

def txntest(a: TealType.uint64, b: TealType.uint64):
    return And(
        Gtxn[Txn.group_index()-Int(1)].amount() == a,
        Gtxn[Txn.group_index()-Int(1)].fee() == b
    )

@Subroutine(TealType.uint64)
def optin(a: TealType.uint64)->Expr:
    return a

@Subroutine(TealType.uint64)
def closeout(a: TealType.uint64)->Expr:
    return a

typedict = {
    TealType.uint64:"uint64",
    TealType.bytes: "string",
}

def typestring(a):
    return typedict[a]

def selector(f: Callable)->str:
    sig = signature(f)
    args= [typestring(p[1].annotation) for p in sig.parameters.items()]

    ret = typestring(f.__closure__[0].cell_contents.returnType)
    if f.__name__ == "qrem":
        ret = "(uint64,uint64)"

    method = "{}({}){}".format(f.__name__, ','.join(args), ret)

    return hashy(method)


def hashy(method: str)->Bytes:

    chksum = SHA512.new(truncate="256")
    chksum.update(method.encode())
    return Bytes(chksum.digest()[:4])


def approval():
    is_app_creator = Txn.sender() == Global.creator_address()

    add_sel = selector(add)
    sub_sel = selector(sub)
    mul_sel = selector(mul)
    div_sel = selector(div)

    qrem_sel = selector(qrem)

    reverse_sel = selector(reverse)

    txn_sel = hashy("txntest(uint64,pay,uint64)uint64")


    router = Cond(
        [Txn.application_args[0] == add_sel, Return(wrap_return_int(add(Btoi(Txn.application_args[1]), Btoi(Txn.application_args[2]))))],
        [Txn.application_args[0] == sub_sel, Return(wrap_return_int(sub(Btoi(Txn.application_args[1]), Btoi(Txn.application_args[2]))))],
        [Txn.application_args[0] == mul_sel, Return(wrap_return_int(mul(Btoi(Txn.application_args[1]), Btoi(Txn.application_args[2]))))],
        [Txn.application_args[0] == div_sel, Return(wrap_return_int(div(Btoi(Txn.application_args[1]), Btoi(Txn.application_args[2]))))],

        [Txn.application_args[0] == qrem_sel, Return(wrap_return_bytes(qrem(Btoi(Txn.application_args[1]), Btoi(Txn.application_args[2]))))],
        [Txn.application_args[0] == reverse_sel, Return(wrap_return_bytes(reverse(Txn.application_args[1])))],

        [Txn.application_args[0] == txn_sel, Return(wrap_return_int(txntest(Btoi(Txn.application_args[1]), Btoi(Txn.application_args[2]))))],
    )

    return Cond(
        [Txn.application_id() == Int(0),                        Return(Int(1))],
        [Txn.on_completion()  == OnComplete.DeleteApplication,  Return(is_app_creator)],
        [Txn.on_completion()  == OnComplete.UpdateApplication,  Return(is_app_creator)],
        [Txn.on_completion()  == OnComplete.CloseOut,           Return(Int(1))],
        [Txn.on_completion()  == OnComplete.OptIn,              Return(Int(1))],
        [Txn.on_completion()  == OnComplete.NoOp,               router],
    )


def clear():
    return Return(Int(1))

if __name__ == "__main__":

    path = os.path.dirname(os.path.abspath(__file__))

    with open(os.path.join(path,"approval.teal"), "w") as f:
        f.write(compileTeal(approval(), mode=Mode.Application, version=5, assembleConstants=True))

    with open(os.path.join(path, "clear.teal"), "w") as f:
        f.write(compileTeal(clear(), mode=Mode.Application, version=5, assembleConstants=True))
