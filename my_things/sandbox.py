beatles = ["1","2","3"]

name = input("Enter a name: ")
name_two = input("Enter the second name: ")

for existing_name in beatles:
    print("se verifica pentru: ",existing_name)
    if name not in beatles:
        print(name," nu exista in beatles , deci il adaugam acum")
        beatles.append(name)
    elif name_two not in beatles:
        print(name_two," nu exista in beatles , deci il adaugam acum")
        beatles.append(name_two)

print(beatles)