Algorand AVM ABI
-----------------


# Method Selector

```
Method signature: add(uint64,uint64)uint128
SHA-512/256 hash (in hex): 8aa3b61f0f1965c3a1cbfa91d46b24e54c67270184ff89dc114e877b1753254a
Method selector (in hex): 8aa3b61f
```


# Method Description

```ts
interface Method {
  name: string,
  desc?: string,
  args: Array<{ name: string, type: string, desc?: string }>,
  returns?: { type: string, desc?: string }
}
```

# Types