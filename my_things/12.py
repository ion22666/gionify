# Implementarea stivei în python


# Crearea unei stive
def create_stack():
    stack = []
    return stack


# Crearea unei stive goale
def check_empty(stack):
    return len(stack) == 0


# Adăugarea elementelor în stivă
def push(stack, item):
    stack.append(item)
    print("elementul adaugat(push): " + item)


# Eliminarea unui element din stivă
def pop(stack):
    if (check_empty(stack)):
        return "stiva este goala"

    return stack.pop()


stack = create_stack()
push(stack, str(1))
push(stack, str(2))
push(stack, str(3))
push(stack, str(4))
print("itemul eliminat(pop): " + pop(stack))
print("stiva dupa ce un elemnt a fost eliminat: " + str(stack))