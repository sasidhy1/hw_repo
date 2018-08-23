import os
import csv

net = 0
count = 0
prev = 0
arr = []

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

		# average profit/losses between months
		change = int(row[1]) - prev
		arr.append(change)	# store into array
		prev = int(row[1])	# update previous value

# print calculated data to terminal
print("Financial Analysis")
print("---------------------------------")

# total number of months in dataset
print(f"months: {count}")

# net amount of profit/losses over entire period
print(f"total: ${net}")

# average profit/losses between months
arr.pop(0)	# remove erroneous calculation
avg = round(sum(arr)/len(arr),2)
print(f"average: ${avg}")