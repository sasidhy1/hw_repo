##### DATABASE SETUP #####



##### FLASK API SETUP #####

# import dependencies
from flask import Flask,jsonify

# create app for flask api
app = Flask(__name__)

# define static routes
@app.route('/')
def index():
	print('Server received request for landing page...')


@app.route('/api/v1.0/precipitation')
def prcp():
	print('Server received request for prcp page...')


@app.route('/api/v1.0/stations')
def stat():
	print('Server received request for stat page...')


@app.route('/api/v1.0/tobs')
def tobs():
	print('Server received request for tobs page...')


@app.route('/api/v1.0/<start>')
def given_start(start):
	print('Server received request for temp range page...')


@app.route('/api/v1.0/<start>/<end>')
def given_start_and_end(start,end):
	print('Server received request for temp range page...')

