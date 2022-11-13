# from django.test import TestCase

# Create your tests here.


def create(validated_data):

    def temp(**validated_data):
        for i,j in validated_data.items():
            print(i,j)

create({0:1})