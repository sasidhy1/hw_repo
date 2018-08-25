# import modules
import os
import csv
import numpy as np

# initialize variables
votes = 0
arr = []
biggest = 0
tal = {}

# declare paths for I/O data
csvpath = os.path.join('election_data.csv')
output = os.path.join('output','results.txt')

# perform calculations, store and update min/max vals
with open(csvpath,newline='') as csvfile:
	csvreader = csv.reader(csvfile,delimiter=',')
	header = next(csvreader)

	# iterate through data
	for row in csvreader:
		# total number of votes cast
		votes = votes + 1

		# collect (last) names of all candidates
		arr.append(str(row[2]))

# select unique candidates
candidates = np.unique(arr)

for name in candidates:
	# calculate percentages, load into dictionary
	perc = '%.3f' % ((arr.count(name)/votes)*100)
	tal[name] = ([perc,arr.count(name)])

	# collect popular vote candidate
	if arr.count(name) > biggest:
		biggest = arr.count(name)
		winner = name

# print election results
print("Election Results")
print("---------------------------------")

# total number of votes cast
print(f"total votes: {votes}")
print("---------------------------------")

# candidates with vote counts
for i in range(0,4):
	print(f"{candidates[i]}: {tal[candidates[i]][0]}% ({tal[candidates[i]][1]})")

# display winning candidate 
print("---------------------------------")
print(f"winner: {winner}")

# output results to textfile
with open(output,'w') as text:
	# print vote count to file
	text.write("Election Results" + "\n")
	text.write("---------------------------------\n")
	text.write("total votes: " + str(votes) + "\n")
	text.write("---------------------------------\n")

	# print data per candidate to file
	for i in range(0,4):
		text.write(str(candidates[i]) + ": " + str(tal[candidates[i]][0]) + "% (" + str(tal[candidates[i]][1]) + ")" + "\n")
	
	# print winner to file
	text.write("---------------------------------\n")
	text.write("winner: " + str(winner) + "\n")
	text.write("---------------------------------\n")