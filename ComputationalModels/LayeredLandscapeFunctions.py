### This file defines key functions used for layered NK landscape
##Functions:
#Position_rand(N) - Generate random landscape position
#Generate_Layered_Landscapes(N,K1,K2) - Generate two Landscapes
#Get_Fitness_Layered_Landscape(Landscape1, Landscape2, Landscape_Weights, Position) - Get Fitness on Layered Landscape given position
#random_walker_layered(Steps, initPosition, Landscape1, Landscape2, Landscape_Weights) - Random Walker fitness history on Layered Landscapes
#Get_AR(TimeData, lag_range) - Get the autocorrelation from timeseries data (the random walker)

##First Load in potentially relevant packages
import numpy as np
import matplotlib.pyplot as plt
import array
import random
import pandas as pd
import itertools
import operator




## Generate a random position on Landscape
##INPUT:
#N - N 
###OUTPUT:
#Pos : Random Position on the landscape
def Position_rand(N):
    Pos = (np.random.rand(N)>0.5)
    Pos = Pos.astype(int)
    #Position = np.repeat(Pos,N)
    #Position = np.full((N, N), Pos, dtype=int)
    #return(Position[1])
    return(Pos)


#### Generate Two Landscapes for the Layered NK Landscape and output them
##Inputs: N, K1, K2
# N - N
# K1 - K for the first Landscape
# K2 - K for the second Landscape
##Outputs: Landscape1,Landscape2
#Landscape1,Landscape2 - The respective NK Landscapes
def Generate_Layered_Landscapes(N,K1,K2):
    Landscape1 = np.random.rand(N, 2**(K1+1))
    Landscape2 = np.random.rand(N, 2**(K2+1))
    return(Landscape1,Landscape2)



    #### Get_Fitness_Layered_Landscape
# This function gets the fitness averaged 2 landscapes (hence layering)
###Inputs:
###Landscape1 - Landscape1 Values
###Landscape2 - Landscape2 Values
###Weights - Vector of weights <w_1,w_2> to average fitness over the two landscapes
###Position - Your Current Position / vector of Interactions
###Output  - Weighted verage fitness over the two landscapes
def Get_Fitness_Layered_Landscape(Landscape1, Landscape2, Landscape_Weights, Position):
    ##First get the fitness for the first landscape
    N=len(Landscape1)
    K=int(np.log2(len(Landscape1[0]))-1)

    totalFitness = 0
    #Loop through all N
    for currIndex in np.arange(N):
        #get the fitness indices from each k based upon local gene values
        localgenes = Position[currIndex:currIndex+K+1]
        #loop through to next if were are near the nth index
        if currIndex+K+1 > N:
            localgenes = np.append(localgenes,Position[ 0:currIndex-(N-K)+1])
        #get index fitness  is stored at
        interactIndex = ((2**(np.arange(K+1)*(localgenes)))*localgenes).sum()
        #update fitness
        totalFitness = totalFitness + Landscape1[currIndex,interactIndex]
    Landscape1Fitness = totalFitness/N

 ##Now get the fitness for the first landscape
    N=len(Landscape2)
    K=int(np.log2(len(Landscape2[0]))-1)

    totalFitness = 0
    #Loop through all N
    for currIndex in np.arange(N):
        #get the fitness indices from each k based upon local gene values
        localgenes = Position[currIndex:currIndex+K+1]
        #loop through to next if were are near the nth index
        if currIndex+K+1 > N:
            localgenes = np.append(localgenes,Position[ 0:currIndex-(N-K)+1])
        #get index fitness  is stored at
        interactIndex = ((2**(np.arange(K+1)*(localgenes)))*localgenes).sum()
        #update fitness
        totalFitness = totalFitness + Landscape2[currIndex,interactIndex]
    Landscape2Fitness = totalFitness/N
    
    ##Now return the weighted average as a  scalar
    #print(np.dot(np.array([Landscape1Fitness,Landscape2Fitness]),Landscape_Weights , out=None))
    return(np.dot(np.array([Landscape1Fitness,Landscape2Fitness]),Landscape_Weights , out=None))





#### get_fitness_One_Landscape Fitness
# This function gets the fitness averaged across the N variables for a given position
# on a single "unlayered" Landscape
###Inputs:
###Landscape - Landscape Values
###Position - Your Current Position / vector of Interactions
###Output  - Average fitness
def Get_Fitness_One_Landscape(Landscape,Position):
    N=len(Landscape)
    totalFitness = 0
    K=int(np.log2(len(Landscape[0]))-1)
    #Loop through all N
    for currIndex in np.arange(N):
        #get the fitness indices from each k based upon local gene values
        localgenes = Position[currIndex:currIndex+K+1]
        #loop through to next if were are near the nth index
        if currIndex+K+1 > N:
            localgenes = np.append(localgenes,Position[ 0:currIndex-(N-K)+1])
        #get index fitness  is stored at
        interactIndex = ((2**(np.arange(K+1)*(localgenes)))*localgenes).sum()
        #update fitness
        totalFitness = totalFitness + Landscape[currIndex,interactIndex]
    return(totalFitness/N)











#####Define a random walker over the layered landscape
## Create a Random Walker, that will for randomly walk across the landscape
### Inputs: Steps, initPosition, Landscape
## Steps - Number of steps the walker takes
## initPosition - inital postition of walker
## Landscape - Input of landscape values
### Outputs: FitnessTime
## FitnessHistory - Fitness recorded over time of the random walker

def random_walker_layered(Steps, initPosition, Landscape1, Landscape2, Landscape_Weights):
    #Get N
    N=len(Landscape1)

    #Set current position
    currPosition = initPosition
    
    #Get first fitness value
    FitnessHistory=Get_Fitness_Layered_Landscape(Landscape1, Landscape2, Landscape_Weights, currPosition)
    for j in range(Steps):
        #Take a step by picking a random gene to change
        toChange = random.randint(0,N-1)
        #this changes 0 to 1 and 1 to zero
        currPosition[toChange] = abs(currPosition[toChange]-1)
        #Append to fitness data
        FitnessHistory =  np.append(FitnessHistory,Get_Fitness_Layered_Landscape(Landscape1, Landscape2, Landscape_Weights, currPosition))

    return(FitnessHistory)



###Using autocorr, make a function that inputs the number of steps (lag range) to compute autocorrelation for
###INPUTs:
#TimeData: Time Series of Fitness
#lag_range: Maximum number of steps to calculate correlation over
###OUTPUT:
# AR: Autocorrelation for each value in the lag_range
def Get_AR(TimeData, lag_range):
    #convert to tome series
    s = pd.Series(TimeData)
    AR=[]
    #loop over ranges
    for r in range(lag_range):
        AR.append(s.autocorr(lag=r))
    return(AR)





## Create an algorithm of search so that we select M(neighborhood step length) from N attirbutes to change,
#then stop when we find an improvment (not maximal local improvement


## Inputs: Landscape, iPosition, M
## Landscape - Input of landscape values
## iPosition - inital postition across all variables
## M - M, number of genes to search over
### Outputs:  NewPosition
## NewPosition - The new optimal position found

###NOTE Be vary careful as with high N and M this becomes exponentially longer

def Incremental_Improvement(iPosition,Landscape1, Landscape2,Landscape_Weights,M):
    #initialize variables
    ChangedGenes = np.array(iPosition[:])
    N=len(Landscape1) # OR N = len(iPosition)
    ##Get current fitness
    CurrentFit = Get_Fitness_Layered_Landscape(Landscape1, Landscape2, Landscape_Weights, iPosition)
    #Create list of all permutations of 0,1 of length M
    for j in range(M+1):
            #Get a list of zeros
            if j==0:
                all_combos=np.zeros((1,M),dtype="int8")
            if j>=1:
                #this works, not fully understood by me, but thank god for stackoverflow.
                which = np.array(list(itertools.combinations(range(M), j)))
                #set a grid of zeros
                grid = np.zeros((len(which), M), dtype="int8")
                #change
                grid[np.arange(len(which))[None].T, which] = 1
                #Magic
                all_combos = np.concatenate((all_combos, grid))
                #Now we have a list of all possible permutations of fitness of length M stored in all_combos

    #What remains is to loop over (up to all) combinations of M indices from our N genes 
    #(we can do combinations here since we did permutations before)

    All_indici_combos = list(itertools.combinations(range(N), M))
    ##now loop over the two, getting the fitness of a new  combo
    for indici in All_indici_combos:
        for gene_combo in all_combos:
            ChangedGenes = np.array(iPosition[:])
            ChangedGenes[list(indici)] = gene_combo 
            #See if new fitness greater than old, if so then we are done
            if(Get_Fitness_Layered_Landscape(Landscape1, Landscape2, Landscape_Weights, ChangedGenes)) > CurrentFit:
                return(ChangedGenes)
    #if no change than return initial position
    return(iPosition)
    ##GOOD IDEA: Should also return another variable if no change that says it is at a local optima.
    #That way we know not to loop over this long algorithm again.

    ###Note: This code is actually not the quickest possible, but it does work. We could make it more efficient
    #so that duplicates do not occur (I won't though, not worth my time)
    
    

    
    
## Create an algorithm of hybrid search that replicates rivkin in Table 7


## Inputs: iPosition, Landscape, iPosition, J,Theta
## iPosition - inital postition across all variables
## Landscape1 - Input of landscape1 values
## Landscape2 - Input of landscape2 values
## Landscape_Weights - Vector of weights for layered landscapes
## bestPosition - Position of Best agent
## J -  number of genes to copy
## Theta -  Probability of Successful copy of each individaul gene/decision
## M - M, number of genes to search over for incremental Improvement


### Outputs:  NewPosition
## NewPosition - The new optimal position found


def Hill_Climb(iPosition,Landscape1,Landscape2,Landscape_Weights,M):
    ##First of all, do an upward hill climb via incremental improvement, but check for potential improvements
    #Set initial genes
    InitialGenes = np.array(iPosition[:])

    #set the current position based upon a first step of going to the leader
    CurrentPosition = InitialGenes
    
    #set fitnesses initially
    currentFitness = Get_Fitness_Layered_Landscape(Landscape1, Landscape2, Landscape_Weights, iPosition) 
    OldFitness = Get_Fitness_Layered_Landscape(Landscape1, Landscape2, Landscape_Weights, CurrentPosition)
    NewGenes = Incremental_Improvement(CurrentPosition, Landscape1, Landscape2, Landscape_Weights, M)
    NewFitness = Get_Fitness_Layered_Landscape(Landscape1, Landscape2, Landscape_Weights, NewGenes)
    
    #keep searching until you reach a maxima
    while(NewFitness!=OldFitness):
       
        OldFitness = NewFitness
        NewGenes = Incremental_Improvement(NewGenes, Landscape1, Landscape2, Landscape_Weights, M) 
        
        NewFitness =  Get_Fitness_Layered_Landscape(Landscape1, Landscape2, Landscape_Weights,  NewGenes) #get_fitness_Product_World(Landscape,NewGenes)
    return(NewGenes)
       
   







    
    
    
    
    
## Create an algorithm of search so that we select M from N attirbutes to change,
#then stop when we find an improvment


## Inputs: Landscape, iPosition, M
## Landscape - Input of landscape values
## iPosition - inital postition across all variables
## M - M, number of genes to search over
### Outputs:  NewPosition
## NewPosition - The new optimal position found

###NOTE Be vary careful as with high N and M this becomes exponentially longer

def Incremental_Improvement2(iPosition,Landscape1, Landscape2,Landscape_Weights,M):
    #initialize variables
    ChangedGenes = np.array(iPosition[:])
    N=len(Landscape) # OR N = len(iPosition)
    ##Get current fitness
    CurrentFit =  Get_Fitness_Layered_Landscape(Landscape1, Landscape2, Landscape_Weights, iPosition)
    #Create list of all permutations of 0,1 of length M
    for j in range(M+1):
            #Get a list of zeros
            if j==0:
                all_combos=np.zeros((1,M),dtype="int8")
            if j>=1:
                #this works, not fully understood by me, but thank god for stackoverflow.
                which = np.array(list(itertools.combinations(range(M), j)))
                #set a grid of zeros
                grid = np.zeros((len(which), M), dtype="int8")
                #change
                grid[np.arange(len(which))[None].T, which] = 1
                #Magic
                all_combos = np.concatenate((all_combos, grid))
                #Now we have a list of all possible permutations of fitness of length M stored in all_combos

    #What remains is to loop over (up to all) combinations of M indices from our N genes 
    #(we can do combinations here since we did permutations before)

    All_indici_combos = list(itertools.combinations(range(N), M))
    ##now loop over the two, getting the fitness of a new  combo
    for indici in All_indici_combos:
        for gene_combo in all_combos:
            ChangedGenes = np.array(iPosition[:])
            ChangedGenes[list(indici)] = gene_combo 
            #See if new fitness greater than old, if so then we are done
            if(Get_Fitness_Layered_Landscape(Landscape1, Landscape2, Landscape_Weights, ChangedGenes)) > CurrentFit:
                return(ChangedGenes)
    #if no change than return initial position
    return(iPosition)
    ##GOOD IDEA: Should also return another variable if no change that says it is at a local optima.
    #That way we know not to loop over this long algorithm again.

    ###Note: This code is actually not the quickest possible, but it does work. We could make it more efficient
    #so that duplicates do not occur (I won't though, not worth my time)





