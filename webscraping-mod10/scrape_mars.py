from bs4 import BeautifulSoup as bs
from splinter import Browser
import pandas as pd
import requests
import time

def init_browser():
	executable_path = {'executable_path': 'chromedriver.exe'}
	return Browser('chrome', **executable_path, headless=False)

def scrape():

	browser = init_browser()
	scraped_data = {}

	#### Nasa Mars News
	url = 'https://mars.nasa.gov/news/'
	browser.visit(url)

	html = browser.html
	soup = bs(html,'html.parser')

	result = soup.find('li',class_='slide')

	news_title = result.find('div',class_='content_title').text
	news_p = result.find('div',class_='article_teaser_body').text

	scraped_data['news_title'] = news_title
	scraped_data['news_p'] = news_p


	#### JPL Mars Space Images
	url = 'https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars'
	browser.visit(url)

	time.sleep(2)
	browser.click_link_by_partial_text('FULL IMAGE')

	time.sleep(2)
	browser.click_link_by_partial_text('more info')

	html = browser.html
	soup = bs(html,'html.parser')

	results = soup.find_all('div',class_='download_tiff')
	for result in results:
		if (result.a):
			if ('jpg' in result.a['href']):
				featured_image_url = result.a['href']

	scraped_data['featured_image_url'] = featured_image_url


	#### Mars Weather
	url = 'https://twitter.com/marswxreport?lang=en'
	response = requests.get(url)

	html = response.text
	soup = bs(html,'html.parser')

	mars_weather = soup.find('p',class_='tweet-text').text

	scraped_data['mars_weather'] = mars_weather


	#### Mars Facts
	url = 'https://space-facts.com/mars/'
	tables = pd.read_html(url)

	df = tables[0]

	df.columns = ['Description','Value']
	df.set_index('Description',inplace=True)

	html_table = df.to_html()
	html_table_str = html_table.replace('\n','')

	scraped_data['html_table_str'] = html_table_str


	#### Mars Hemispheres
	url = 'https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars'
	browser.visit(url)

	html = browser.html
	soup = bs(html,'html.parser')

	results = soup.find_all('div',class_='description')

	base = 'https://astrogeology.usgs.gov'

	hemisphere_image_urls = []
	for result in results:
		holder = {}
		if (result.a):
			if (result.a.text):
				holder['title'] = result.a.text[:-9]

			browser.visit(base + result.a['href'])

			html = browser.html
			soup = bs(html,'html.parser')
			downloads = soup.find('div',class_='downloads')
			holder['img_url'] = downloads.find('li').a['href']

		hemisphere_image_urls.append(holder)

	scraped_data['hemisphere_image_urls'] = hemisphere_image_urls

	browser.quit()

	return scraped_data