from __future__ import print_function
import json

# Check if the number is a decimal. If yes, find the number of decimal places.
def precision_counter(input):
    if (input.find('.') == -1):
        return 0                          # integer
    else:
        return (len(input.split('.')[1]))  # decimal

# Takes in a JSON object with 2 numbers, adds them and returns the result
# Using JSON to allow for expandability
def sum(input_obj):
    obj_dict = json.loads(input_obj)  # converts to a python dictionary
    input1 = str(obj_dict["input1"])
    input2 = str(obj_dict["input2"])

    # find the maximum precision for output format
    precision = max(precision_counter(input1), precision_counter(input2))

    # using float to account for decimal numbers
    result = float(obj_dict["input1"]) + float(obj_dict["input2"])
    
    # return output with correct precision
    result = "{:.{}f}".format(result, precision)
    return result
