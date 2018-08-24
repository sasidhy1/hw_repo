# import modules
import os
import csv

# initialize variables
net = 0
count = 0
avg = 0
arr = []
prev = 0
biggest = 0
smallest = 0

# declare paths for I/O data
csvpath = os.path.join('budget_data.csv')
output = os.path.join('output','analysis.txt')

def fin_analysis(count,net,arr,datemax,datemin,biggest,smallest):
	# total number of months, net profit/losses
	print(f"months: {count}")
	print(f"total: ${net}")

	# average profit/losses
	arr.pop(0)							# remove erroneous calculation
	avg = round(sum(arr)/len(arr),2)	# calculate average
	print(f"average: ${avg}")

	# greatest in/decrease, date + amount
	print(f"greatest increase: {datemax} ({biggest})")
	print(f"greatest decrease: {datemin} ({smallest})")

# perform calculations, store and update min/max vals
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

# print financial analysis
print("Financial Analysis")
print("---------------------------------")
fin_analysis(count,net,arr,datemax,datemin,biggest,smallest)

# output results to textfile
with open(output,'w') as text:
	text.write("Financial Analysis" + "\n")
	text.write("---------------------------------\n")
	text.write("months: " + str(count) + "\n")
	text.write("total: " + str(net) + "\n")
	text.write("average: " + str(avg) + "\n")
	text.write("greatest increase: " + str(datemax) + "(" + str(biggest) + ")" + "\n")
	text.write("greatest decrease: " + str(datemin) + "(" + str(smallest) + ")")