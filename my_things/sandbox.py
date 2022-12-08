
# O calsa pentru node-uri
class Node:

    # Functia de initialzare al unui node / aka. constructor
    def __init__(self, data=None):
        self.data = data  # Adaugat proprietatea "data" unde se va insera continutul/valoarea
        self.next = None  # O proprietate ce va contine un pointer pentru urmatorul node

# O clasa pentru listele legate
class LinkedList:

    # Functia de initialzare al unei liste
    def __init__(self):
        self.head = None # pointer pentru locul de start al listei/ primul node

    # Aceasta functie este parte din clasa LinkedList
    # O folosim pentru a adauga un nou nod in fata listei
    def push(self, new_data):
    
        # Cream un node nou cu clasa Node
        # Si punem niste date in el "new_data"
        new_node = Node(new_data)
            
        # Acest nod nou, va fi primul
        # deci el va deveni noul head
        # iar vechiul head va deveni "next" pentru nodul nou
        new_node.next = self.head
        self.head = new_node

    # Aceasta functie este parte din clasa LinkedList
    # Inserează un nou nod după "prev_node" dat
    def insertAfter(self, prev_node, new_data):
    
        # verificam dacă prev_nod dat există
        if prev_node is None:
            print("Nu exista nodul introdus")
            return
    
        # Cream un nou nod
        # Introducem datele
        new_node = Node(new_data)
    
        # Facem ca următorul din noul nod să fie următorul din prev_nod
        new_node.next = prev_node.next
    
        # face "next" din prev_nod sa fie nou_nod / "new_node"
        prev_node.next = new_node

    # Aceasta functie este parte din clasa LinkedList
    # Adaugăm un nou nod la sfârșit.
    def append(self, new_data):
    
            # Cream un nod nou
            # Introducem datele
            # Declaram "next" ca None, 
            # deoarece acest nod va fi ultimul
            new_node = Node(new_data)
    
            # Dacă lista legată este goală, atunci
            # atunci noul nod va deveni "head"
            if self.head is None:
                self.head = new_node
                return
    
            # Altfel, parcurgem până la ultimul nod
            last = self.head
            while (last.next):
                last = last.next
    
            # Modificam "next"-ul vechiului nod 
            # care era ultimul
            last.next = new_node

my_list = LinkedList()

# adaugam un node la capul liste
my_list.push("head")

# adaugam un node la coada liste
my_list.append("ultimul nod")

# adaugam un node dupa "head_node"
my_list.insertAfter(my_list.head,"dupa head")

nod = my_list.head
while nod:
    print(nod.data)
    nod=nod.next