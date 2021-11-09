from pyteal import Int, Seq, Txn, Global, compileTeal, Return, OnComplete, Mode, Cond, Btoi, ScratchVar, For, TealType, Log, Concat, Bytes, Subroutine
import os

from util import itoa


# Subroutine allows a method to be defined once and called as many times as you'd like
# This saves space in the resultant teal program if you have some function you use frequently
@Subroutine(TealType.none)
def sing(count):
    return Seq(
        # Each call to Log takes the bytestring passed and logs the message 
        # itoa is a subroutine in the util.py file, it converts an integer to a bytestring
        # representing the ascii numberic characters
        Log(Concat(itoa(count), Bytes(" Bottles of beer on the wall"))),
        Log(Concat(itoa(count), Bytes(" Bottles of beer"))),
        Log(Bytes("Take one down, pass it around")),
        Log(Concat(itoa(count-Int(1)), Bytes(" Bottles of beer on the wall")))
    )

def approval():

    # Checks that the app call sender is the creator of this app
    is_app_creator = Txn.sender() == Global.creator_address()

    # Create a scratch var for iteration
    i = ScratchVar()

    # Set up the components of the for loop
    #  start at 99 because thats how the song goes
    init = i.store(Int(99))
    #  this is the condition that will be evaluated in the for loop
    #  the for loop will terminate when this returns false 
    cond = i.load()>Int(97)
    #  this is the decrement portion of this for loop, just subtracts 1 for every loop iteration
    iter = i.store(i.load() - Int(1))

    log = Seq(
        # Call the for loop with the components we defined above
        For(init, cond, iter).Do(
            # sing is called with the current value of i, 
            # it doesn't return anything so it is fine to include in 
            # the `Do` portion of the loop
            sing(i.load())
        ),
        # Return 1 so the transaction will pass
        Int(1)
    )

    return Cond(
        [Txn.application_id() == Int(0),                        Return(Int(1))],
        [Txn.on_completion()  == OnComplete.DeleteApplication,  Return(is_app_creator)],
        [Txn.on_completion()  == OnComplete.UpdateApplication,  Return(is_app_creator)],
        [Txn.on_completion()  == OnComplete.CloseOut,           Return(Int(1))],
        [Txn.on_completion()  == OnComplete.OptIn,              Return(Int(1))],
        [Txn.on_completion()  == OnComplete.NoOp,               Return(log)],
    )

def clear():
    return Return(Int(1))

if __name__ == "__main__":

    path = os.path.dirname(os.path.abspath(__file__))

    with open(os.path.join(path,"looping.teal"), "w") as f:
        f.write(compileTeal(approval(), mode=Mode.Application, version=5))

    with open(os.path.join(path, "clear.teal"), "w") as f:
        f.write(compileTeal(clear(), mode=Mode.Application, version=5))