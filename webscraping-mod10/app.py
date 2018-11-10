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
	print('Server received request.')

	mars_data = mongo.db.collection.find()
	
	return render_template('index.html',mars_data=mars_data)

@app.route('/scrape')
def scrape():
	scraped_data = scrape_mars.scrape()

	mongo.db.collection.drop()
	mongo.db.collection.insert_one(scraped_data)

	return redirect('/',code=302)

if __name__ == '__main__':
	app.run(debug=True)