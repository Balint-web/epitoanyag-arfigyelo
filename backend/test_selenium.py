from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options

chrome_options = Options()
chrome_options.add_argument("--headless")  # Ha nem akarsz ablakot megnyitni
service = Service("C:/webdrivers/chromedriver.exe")  # ← pontos útvonal a gépeden

driver = webdriver.Chrome(service=service, options=chrome_options)
driver.get("https://www.mentavill.hu/termekek/asfora/")

print("Oldalcím:", driver.title)
driver.quit()
