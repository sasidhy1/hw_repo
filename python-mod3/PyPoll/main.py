# import modules
import os
import csv
import numpy as np

# initialize variables
votes = 0
arr = []
biggest = 0

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

print(candidates)

# display winning candidate 
print("---------------------------------")
print(f"winner: {winner}")