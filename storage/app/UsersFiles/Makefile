###########################################################  Makefile
# CS570, Summer 2014, a2
# Adrian Galicia, masc1442
###########################################################
TORM = *.o  $(EXEC)
EXEC = a2
CC = g++      ###  or use cc / g++ / gcc   ### 
CCFLAGS = -pthread -lrt  -Wall -std=gnu++11 -Wall

$(EXEC):	a2.o
	$(CC) $(CCFLAGS) -o  $(EXEC) a2.o

a2.o:	a2.cpp a2.h
	$(CC) $(CCFLAGS) -c a2.cpp a2.h 

clean:
	rm -f $(TORM)

#######################[ EOF: Makefile ]###################
