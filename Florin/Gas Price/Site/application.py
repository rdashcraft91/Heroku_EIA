# dependencies
from flask import Flask, jsonify, render_template
import json
import pymongo

# Setup mongo connection
client = pymongo.MongoClient("mongodb+srv://all_user:eiaproject@cluster0-qoy1h.mongodb.net/eia_db?retryWrites=true&w=majority")


#################################################
# Database Setup
#################################################
# connect to mongo db and collection
db = client.eia_db
total_energy = db.total_energy
state_energy = db.state_collection
price_data = db.price_data
energy_prices = db.energy_prices


#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
#################################################


@app.route("/")
def welcome():
    return render_template("index.html")

@app.route("/api/v1.0")
def show_apis():
    """List all available api routes."""
    return (
        f"<h4>Available Routes:</h4>"
        f'<a href="/api/v1.0/total_energy">/api/v1.0/total_energy</a><br/>'
        f'<a href="/api/v1.0/state_energy">/api/v1.0/state_energy</a><br/>'
        f'<a href="/api/v1.0/price_data">/api/v1.0/price_data</a><br/>' 
        f'<a href="/api/v1.0/energy_prices">/api/v1.0/energy_prices</a><br/>'         

    )    

@app.route("/api/v1.0/total_energy")
def get_total_energy():
    # data = total_energy.find_one('consumption') # To select one id of data
    data = list(total_energy.find())  # To look at all data
    return jsonify(data)

@app.route("/api/v1.0/state_energy")
def get_state_energy():
    # data = state_energy.find_one('consumption') # To select one id of data
    data = list(state_energy.find())  # To look at all data
    return jsonify(data)  

@app.route("/api/v1.0/price_data")
def get_price_data():
    data = list(price_data.find())  # To look at all data
    return jsonify(data)     

@app.route("/api/v1.0/energy_prices")
def get_energy_prices():
    data = list(energy_prices.find())  # To look at all data
    return jsonify(data)  


if __name__ == '__main__':
    app.run(debug=True)