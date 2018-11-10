from flask import Flask,redirect
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
	return 'Welcome to home page!'

@app.route('/scrape')
def scrape():
	scraped_data = scrape_mars.scrape()
	return redirect('/',code=302)

if __name__ == '__main__':
	app.run(debug=True)