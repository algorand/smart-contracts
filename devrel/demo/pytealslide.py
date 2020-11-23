from pyteal import *

"""Basic Bank"""

def bank_for_account(receiver):
    is_payment = Txn.type_enum() == TxnType.Payment
    is_single_tx = Global.group_size() == Int(1)
    is_correct_receiver = Txn.receiver() == Addr(receiver)

    return And(
        is_payment,
        is_single_tx,
        is_correct_receiver
    )
if __name__ == "__main__":
    program = bank_for_account("ZZAF5ARA4MEC5PVDOP64JM5O5MQST63Q2KOY2FLYFLXXD3PFSNJJBYAFZM")
    print(compileTeal(program, Mode.Signature))