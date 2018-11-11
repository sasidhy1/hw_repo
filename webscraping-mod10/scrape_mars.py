# import dependencies
from bs4 import BeautifulSoup as bs
from splinter import Browser
import pandas as pd
import requests
import time

# initialize chromedriver browser instance
def init_browser():
	executable_path = {'executable_path': 'chromedriver.exe'}
	return Browser('chrome', **executable_path, headless=False)

# return scraped results as dict
def scrape():

	# declare empty dict
	scraped_data = {}

	# create browser instance
	browser = init_browser()

	########################
	#### Nasa Mars News ####
	########################

	# visit target site
	url = 'https://mars.nasa.gov/news/'
	browser.visit(url)

	# break into soup
	html = browser.html
	soup = bs(html,'html.parser')

	# find first .slide element, most recent article
	result = soup.find('li',class_='slide')

	# grab text results
	news_title = result.find('div',class_='content_title').text
	news_p = result.find('div',class_='article_teaser_body').text

	# load into dict
	scraped_data['news_title'] = news_title
	scraped_data['news_p'] = news_p

	###############################
	#### JPL Mars Space Images ####
	###############################

	# visit target site
	url = 'https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars'
	browser.visit(url)

	# pause execution to load page, navigate to full img
	time.sleep(2)
	browser.click_link_by_partial_text('FULL IMAGE')

	# pause execution to load page, navigate to img details
	time.sleep(2)
	browser.click_link_by_partial_text('more info')

	# break into soup
	html = browser.html
	soup = bs(html,'html.parser')

	# find all .download_tiff elements, two returned
	results = soup.find_all('div',class_='download_tiff')

	# look for hq .jpg file, grab url
	for result in results:
		if (result.a):
			if ('jpg' in result.a['href']):
				featured_image_url = result.a['href']

	# load into dict
	scraped_data['featured_image_url'] = featured_image_url

	######################
	#### Mars Weather ####
	######################

	# request target site
	url = 'https://twitter.com/marswxreport?lang=en'
	response = requests.get(url)

	# break into soup
	html = response.text
	soup = bs(html,'html.parser')

	# find first .tweet-text element, most recent tweet
	mars_weather = soup.find('p',class_='tweet-text').text

	# load into dict
	scraped_data['mars_weather'] = mars_weather

	####################
	#### Mars Facts ####
	####################

	url = 'https://space-facts.com/mars/'
	tables = pd.read_html(url)

	df = tables[0]

	df.columns = ['Description','Value']
	df.set_index('Description',inplace=True)

	html_table = df.to_html()
	html_table_str = html_table.replace('\n','')

	# load into dict
	scraped_data['html_table_str'] = html_table_str

	##########################
	#### Mars Hemispheres ####
	##########################

	# visit target site
	url = 'https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars'
	browser.visit(url)

	# break into soup
	html = browser.html
	soup = bs(html,'html.parser')

	# find all .description elements
	results = soup.find_all('div',class_='description')

	# declare base url
	base = 'https://astrogeology.usgs.gov'

	# grab hq images for each element, append to empty array
	hemisphere_image_urls = []
	for result in results:
		
		# return trimmed text and img url, append to empty dict
		holder = {}
		if (result.a):
			if (result.a.text):

				# append trimmed text if exists
				holder['title'] = result.a.text[:-9]

			# visit each target site if exists
			browser.visit(base + result.a['href'])

			# break each into soup
			html = browser.html
			soup = bs(html,'html.parser')

			# find .downloads element
			downloads = soup.find('div',class_='downloads')
			
			# append img url
			holder['img_url'] = downloads.find('li').a['href']	

		# append each dict into arr
		hemisphere_image_urls.append(holder)

	# load arr into dict
	scraped_data['hemisphere_image_urls'] = hemisphere_image_urls

	# remember to quit browser
	browser.quit()

	# return loaded dictionary
	return scraped_data