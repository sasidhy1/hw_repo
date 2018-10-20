###########################
##### DATABASE SETUP ######
###########################

# import dependencies
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session,sessionmaker
from sqlalchemy import create_engine,func

# Specify db location
engine = create_engine("sqlite:///Resources/hawaii.sqlite")

# Reflect an existing database into a new model
Base = automap_base()

# Reflect the tables
Base.prepare(engine, reflect=True)

# Save references to each table
Measurement = Base.classes.measurement
Station = Base.classes.station

# Create our session (link) from Python to the DB
session_factory = sessionmaker(bind=engine)

###########################
##### FLASK API SETUP #####
###########################

# import dependencies
from flask import Flask,jsonify
from flask_sqlalchemy_session import flask_scoped_session
import numpy as np
import datetime as dt

# create app for flask api
app = Flask(__name__)

# create unique sessions per flask request
session = flask_scoped_session(session_factory,app)

# define static routes
@app.route('/')
def index():
	print('Server received request for landing page...')
	return	(
		f"Available routes:<br>"
		f"<a href='/api/v1.0/precipitation'>/api/v1.0/precipitation</a><br>"
		f"<a href='/api/v1.0/stations'>/api/v1.0/stations</a><br>"
		f"<a href='/api/v1.0/tobs'>/api/v1.0/tobs</a><br>"
		f"<a href='/api/v1.0/<start>'>/api/v1.0/&lt;start&gt;</a><br>"
		f"<a href='/api/v1.0/<start>/<end>'>/api/v1.0/&lt;start&gt;/&lt;end&gt;</a><br>"
	)

@app.route('/api/v1.0/precipitation')
def prcp():
	print('Server received request for prcp page...')
	
	end_date = session.query(Measurement.date).\
		order_by(Measurement.date.desc()).first()[0]
	
	dat = [int(n) for n in end_date.split('-')]

	y = dt.date(*dat).strftime("%Y")
	m = dt.date(*dat).strftime("%m")
	d = dt.date(*dat).strftime("%d")
	yr_ago = dt.date(2017-1,8,23)

	query = session.query(Measurement.date,Measurement.prcp).\
		filter(Measurement.date > yr_ago).\
		order_by(Measurement.date).all()

	all_data = []
	for i in query:
		this_dict = {}
		this_dict[i[0]] = i[1]
		all_data.append(this_dict)

	return jsonify(all_data)

@app.route('/api/v1.0/stations')
def stat():
	print('Server received request for stat page...')
	query = session.query(Station.name).all()

	disp = list(np.ravel(query))
	return jsonify(disp)

@app.route('/api/v1.0/tobs')
def tobs():
	print('Server received request for tobs page...')
	yr_ago = dt.date(2017-1,8,23)

	sel = [Measurement.station,
		Measurement.date,
		Measurement.tobs]

	query = session.query(*sel).\
		filter(Station.station == Measurement.station).\
		filter(Station.station == 'USC00519281').\
		filter(Measurement.date > yr_ago).\
		order_by(Measurement.date).all()

	all_data = []
	for i in query:
		this_dict = {}
		this_dict[i[1]] = i[2]
		all_data.append(this_dict)

	return jsonify(all_data)

@app.route('/api/v1.0/<start>')
def given_start(start):
	print('Server received request for supplied path variable...')
	sel = [func.min(Measurement.tobs),
		func.max(Measurement.tobs),
		func.avg(Measurement.tobs)]

	query = session.query(*sel).\
		filter(Station.station == Measurement.station).\
		filter(Measurement.date > start).\
		filter(Station.station == 'USC00519281').all()

	all_data = []
	for i in query:
		this_dict = {}
		this_dict['min'] = i[0]
		this_dict['max'] = i[1]
		this_dict['avg'] = i[2]
		all_data.append(this_dict)

	return jsonify(all_data)

@app.route('/api/v1.0/<start>/<end>')
def given_start_and_end(start,end):
	print('Server received request for supplied path variables...')

	sel = [func.min(Measurement.tobs),
		func.max(Measurement.tobs),
		func.avg(Measurement.tobs)]

	query = session.query(*sel).\
		filter(Station.station == Measurement.station).\
		filter(Measurement.date > start).\
		filter(Measurement.date < end).\
		filter(Station.station == 'USC00519281').all()

	all_data = []
	for i in query:
		this_dict = {}
		this_dict['min'] = i[0]
		this_dict['max'] = i[1]
		this_dict['avg'] = i[2]
		all_data.append(this_dict)

	return jsonify(all_data)

if __name__ == '__main__':
	app.run(debug=True)