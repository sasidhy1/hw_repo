import os
import csv

net = 0
count = 0

csvpath = os.path.join('budget_data.csv')
output = os.path.join('output.txt')

with open(csvpath,newline='') as csvfile:
	csvreader = csv.reader(csvfile,delimiter=',')
	header = next(csvreader)

	for row in csvreader:
		# total number of months in dataset
		count = count + 1

		# net amount of profit/losses over entire period
		net = int(row[1]) + net

print("Financial Analysis")
print("---------------------------------")
print(f"months: {count}")
print(f"total: ${net}")