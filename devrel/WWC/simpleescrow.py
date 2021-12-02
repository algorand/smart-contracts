from pyteal import *

def app():
    handle_noop = Seq(
        Assert(Txn.application_args[0] == Bytes("payme")),
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum : TxnType.Payment,
            TxnField.amount : Int(5000),
            TxnField.receiver : Txn.sender()
        }),
        InnerTxnBuilder.Submit(),
        Int(1)
    )

    return Cond(
        [Txn.application_id() == Int(0), Approve()],
        [Txn.on_completion() == OnComplete.NoOp, Return(handle_noop)]
    )

if __name__=='__main__':
    print(compileTeal(app(), mode=Mode.Application, version=5))