import requests
from bs4 import BeautifulSoup

# URL of the page
url = 'https://www.choose.va.gov/housing-assistance'

# Fetch and parse the page
response = requests.get(url)
response.raise_for_status()
soup = BeautifulSoup(response.text, 'html.parser')

# Find the <article> element
article = soup.find('article')
if not article:
    raise Exception("Article element not found")

# Get the raw HTML inside <article>
article_html = article.decode_contents()

# Print or save the HTML
print(article_html)

# Optional: save to a file
with open('va_housing_assistance_article.html', 'w', encoding='utf-8') as file:
    file.write(article_html)
