import os
import csv

net = 0
count = 0
arr = []
prev = 0
biggest = 0
smallest = 0

csvpath = os.path.join('budget_data.csv')
output = os.path.join('output','analysis.txt')

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

		# greatest profit increase, date and amount
		if change > biggest:
			biggest = change
			datemax = row[0]
	
		# greatest loss decrease, date and amount
		elif change < smallest:
			smallest = change
			datemin = row[0]

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

# greatest profit increase, date and amount
print(f"greatest increase: {datemax} ({biggest})")

# greatest loss decrease, date and amount
print(f"greatest decrease: {datemin} ({smallest})")

with open(output,'w') as text:
	text.write("Financial Analysis" + "\n")
	text.write("---------------------------------\n")
	text.write("months: " + str(count) + "\n")
	text.write("total: " + str(net) + "\n")
	text.write("average: " + str(avg) + "\n")
	text.write("greatest increase: " + str(datemax) + "(" + str(biggest) + ")" + "\n")
	text.write("greatest decrease: " + str(datemin) + "(" + str(smallest) + ")")