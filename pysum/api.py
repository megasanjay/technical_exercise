from __future__ import print_function
from sum import sum as real_sum
import sys
import zerorpc

class Calcsum(object):
    def sum(self, input_obj):
        #takes in a JSON object, return the int result
        try:
            return real_sum(input_obj) 
        except Exception as e:
            print(e)
            return 0   
    def echo(self, input_obj):
        # passes back the object
        return input_obj

def parse_port():
    port = 4242
    try:
        port = int(sys.argv[1])
    except Exception as e:
        print(e)
        pass
    return '{}'.format(port)

def main():
    addr = 'tcp://127.0.0.1:' + parse_port()
    s = zerorpc.Server(Calcsum())
    s.bind(addr)
    print('start running on {}'.format(addr))
    s.run()

if __name__ == '__main__':
    main()
