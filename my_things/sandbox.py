import os
from flask import Flask
from threading import Thread
import discord
from dotenv import load_dotenv
import random
import datetime
load_dotenv()
TOKEN = os.getenv('MTAzNDAxODgzNDE1NzQwODI3Ng.GUZNvY.ZNpWGI1xcVp1vQXyWMYRIrBv_L8SsaGuqskdBU')

client = discord.Client(intents=discord.Intents.all())

@client.event
async def on_ready():
    print(f' {client.user} Sa mori tu')

@client.event
async def  on_message(message):
    username = str(message.author).split('#')[0]
    user_message =str(message.content)
    channel = str(message.channel.name)
    print(f'{username}:{user_message}({channel})')

    


    if message.author == client.user:
        print('autorul este botul')
        return
    if True:
        await message.channel.send(f'username:{username}\nchannel:{channel}\nuser_message:{user_message}')
        return
    if message.channel.name == 'nustiu':
        print('pe canalul nustiu')

        if user_message.lower() =='cat ii ceasu':
            print('mesajul este hello')
            await message.channel.send(f'este: {datetime.datetime.now()}!')
            return

        if user_message.lower() =='hello':
            print('mesajul este hello')
            await message.channel.send(f'hello{username}!')
            return
        elif user_message.lower() == 'bye':
            print('mesajul este bye')
            await message.channel.send(f'see you later{username}!')
            return
        elif user_message.lower() == '!random':
            print('mesajul este !random')
            response = f'numarul tau:{random.randrange(1000000)}'
            await message.channel.send(response)
            return

    if user_message.lower() == '!anywhere':
        await message.channel.send('This can be used anywhere !')
        return



client.run('MTAzNDAxODgzNDE1NzQwODI3Ng.GUZNvY.ZNpWGI1xcVp1vQXyWMYRIrBv_L8SsaGuqskdBU')
'''
app = Flask('')

@app.route('/')
def home():
    return "Dapu cum"

def run():
  app.run(host='0.0.0.0',port=8080)

def keep_alive():
    t = Thread(target=run)
    t.start()'''