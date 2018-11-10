from flask import Flask,redirect,render_template
from flask_pymongo import PyMongo
import scrape_mars

# create app
app = Flask(__name__)

# set up mongo connection
mongo = PyMongo(app, uri='mongodb://localhost:27017/mars_app')

# define static routes
@app.route('/')
def index():

	# grab existing collection as dict
	print('Looking for existing collection...',end='')
	mars_data = mongo.db.collection.find_one()
	print('done.')

	# render html template, passing dictionary
	return render_template('index.html',mars_data=mars_data)

@app.route('/scrape')
def scrape():

	# run scrape function, store as dict
	print('Scraping in progress...',end='')
	scraped_data = scrape_mars.scrape()
	print('done.')

	# drop previous scrape
	print('Dropping old collection...',end='')
	mongo.db.collection.drop()
	print('done.')

	# insert current scrape
	print('Rendering scraped data...',end='')
	mongo.db.collection.insert_one(scraped_data)
	print('done.')

	return redirect('/',code=302)

if __name__ == '__main__':
	app.run(debug=True)