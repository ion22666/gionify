
d = {}
try:
    print("0")
    if 1:
        print("1")
        if 1:
            print("2")
            d["a"]
            if 1:
                print("4")
except KeyError:
    print("key error")