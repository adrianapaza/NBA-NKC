import numpy as np
import matplotlib.pylab as plt
import array
import random
import pandas as pd
import itertools
import operator
from scipy import stats
import itertools as it
import networkx as nx
from collections import defaultdict


"""
LANDSCAPE GENERATING FUNCTIONS

Functions for creating standard NK landscapes, a Dirichlet landscape, and 'layered' combinations
of them.

make_NK_land() just needs the N and the K

make_Dirichland() takes an N and K, but also an array of concentration parameters for
the underlying Dirichlet distribution. It also has a scalar parameter because the Dirichlet is on the simplex and therefore has smaller values than the NK model.

make_layered() takes two landscapes and an argument specifying how to combine them.

"""

def make_NK_land(N, K):
    return np.random.rand(N, 2**(K+1))


def make_Dirichland(N,K, concentration_params, scalar=2):

    our_dirichlet = stats.dirichlet(concentration_params) #the distribution we use

    NK_land = np.random.rand(N, 2**(K+1))

    fitnesses = []
    permutations = []
    dir_draw = our_dirichlet.rvs()[0]

    all_permutations = list(itertools.product([0,1],repeat=N))

    for permutation in all_permutations:

        genome_fitness = 0
        for currIndex in np.arange(N):
            #get the fitness indices from each k based upon local gene values
            localgenes = permutation[currIndex:currIndex+K+1]
            #loop through to next if were are near the nth index
            if currIndex+K+1 > N:
                localgenes = np.append(localgenes,permutation[0:currIndex-(N-K)+1])
            #get index fitness  is stored at
            interactIndex = ((2**(np.arange(K+1)*(localgenes)))*localgenes).sum()
            #update fitness

            genome_fitness += NK_land[currIndex,interactIndex] * (1-dir_draw[currIndex])
        fitnesses.append(genome_fitness)
        permutations.append("".join([str(i) for i in permutation]))

    df = pd.DataFrame(fitnesses,index=permutations,columns=["Fitness"])
    df.loc[:,'Location'] = all_permutations
    return df

def sorted_NK_landscape(N,K):
    df = Fitness_Mapping(make_NK_land(N,K))
    df = df.sort_values(by="Fitness")
    fitnesses = list(df.Fitness)

    hypercube = nx.hypercube_graph(N)
    chosen_peak = tuple((np.random.rand(N)>0.5).astype(int))
    #sorted_landscape[chosen_peak] = fitnesses.pop() #last item is the largest remaining

    node_dict = nx.shortest_path_length(hypercube, chosen_peak)
    distance_dict = defaultdict(list)
    max_dist = 0
    for key, dist in node_dict.items():
        distance_dict[dist].append(key)
        if dist > max_dist:
            max_dist = dist

    sorted_landscape = {}
    for dist in range(dist):
        for location in distance_dict[dist]:
            sorted_landscape["".join([str(i) for i in location])] = (fitnesses.pop(),location)

    return pd.DataFrame.from_dict(sorted_landscape,orient="index",columns=["Fitness","Location"])


def layer_landscapes(Landscape1, Landscape2, layering_mode="addition", weights=None):


    if layering_mode == "average":
        assert weights != None, "You need to provide weights for the average"
        Landscape1.Fitness = ((Landscape1.Fitness*weights[0])+(Landscape2.Fitness*weights[1]))/2.
        return Landscape1

    if layering_mode == "addition":
        Landscape1.Fitness = Landscape1.Fitness + Landscape2.Fitness
        return Landscape1

    if layering_mode == "multiplication":
        Landscape1.Fitness = (Landscape1.Fitness+.5) * (Landscape2.Fitness + .5)
        return Landscape1


"""
FITNESS EVALUATION FUNCTION

A function for getting the fitness value of a position in the landscape.
"""

def Get_Landscape_Fitness(Landscape,Position):
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
    return totalFitness/N

"""
FITNESS MAPPING

Calculates the fitness for all positions in the landscape and returns them in a DataFrame
"""
def Fitness_Mapping(Landscape):
    #Get N and K
    N=len(Landscape)
    K=int(np.log2(len(Landscape[0]))-1)

    all_permutations = list(itertools.product([0,1],repeat=N))

    Fitnesses = []
    permutations = []
    for perm in all_permutations:
        Fitnesses.append(Get_Landscape_Fitness(Landscape, perm))
        permutations.append("".join([str(i) for i in perm]))


    All_Fitness_Data_Frame=pd.DataFrame(Fitnesses,index=permutations,columns=["Fitness"])
    All_Fitness_Data_Frame.loc[:,'Location'] = all_permutations

    return All_Fitness_Data_Frame



"""
RANDOM WALKER FUNCTION

Given an initial starting position, does a random walk over the landscape.


"""
def random_walker(Steps, FitnessMap):

    #Get N
    N=len(FitnessMap.iloc[0].name)

    #Set random starting position
    currPosition = (np.random.rand(N)>0.5).astype(int)

    #Get first fitness value
    FitnessHistory=[FitnessMap.loc["".join([str(i) for i in currPosition])].Fitness]
    for j in range(Steps):
        #Take a step by picking a random gene to change
        toChange = random.randint(0,N-1)
        #this changes 0 to 1 and 1 to zero
        currPosition[toChange] = abs(currPosition[toChange]-1)
        #Append to fitness data
        fit = FitnessMap.loc["".join([str(i) for i in currPosition])].Fitness
        FitnessHistory.append(fit)

    return FitnessHistory


def landscape_as_graph(df):

    N=len(df.iloc[0].name)
    hypercube = nx.hypercube_graph(N)

    fitness_diff_dict = {}
    for focal_row in df.itertuples():
        source_fit = focal_row.Fitness
        Neighbors = df[df['Location'].apply(lambda row : sum(abs(np.array(row)-np.array(focal_row.Location)))==1)]
        for neighbor in Neighbors.itertuples():
            fitness_diff_dict[(focal_row.Location,neighbor.Location)] = abs(source_fit-neighbor.Fitness)

    nx.set_edge_attributes(hypercube, fitness_diff_dict,"fitness_difference")

    return hypercube

"""
LANDSCAPE MEASUREMENTS

A bunch of different ways for comparing landscapes or walks over them
"""

# Gets the autocorrelation of the series of fitnesses obtained from a random walk.
def Get_AR(TimeData, lag_range):
    #convert to time series
    s = pd.Series(TimeData)

    return [s.autocorr(lag=r) for r in range(lag_range)]


def Count_Local_Maxima(df):
    #Set A Maxima counter
    Num_Local_Max=0
    #Loop over all rows
    for focal_row in df.itertuples():
        #Identify the Neighbors (distance of 1 from focal row)
        Neighbors = df[df['Location'].apply(lambda row : sum(abs(np.array(row)-np.array(focal_row.Location)))==1)]        #Get the maximum fitness value of the neighbors
        Neighbors_Max = max(Neighbors.Fitness) #fitness is indexed at 0 here for some reason

        ##See if the neighbors max does not exceed the focal max, if not then it is a local maxima
        if Neighbors_Max < focal_row.Fitness: #fitness is indexed at 1 here for some reason
            #print('Local Maxima found')
            Num_Local_Max += 1
        #Append the focal row at the end

    return Num_Local_Max



def Get_Landscape_Statistics(df,N,K):


    ##Record the autocorrelation of a random walk
    FitnessPath = random_walker(1000, df)
    AR = Get_AR(FitnessPath,lag_range=N)


    ##Now find the maximum and minimum.
    MaximalLocation = df.iloc[:,0].idxmax()    #get the index
    MaximalFitness = df.iloc[:,0].max() #get the fitness value
    #MaximalFitness2 = df[MaximalLocation,0]
    #,MaximalFitness2)
    MinimalLocation = df.iloc[:,0].idxmin()
    MinimalFitness = df.iloc[:,0].min()

    #Get normalized difference between min and max (by dividing by standard deviation)
    NormDiff = (MaximalFitness-MinimalFitness)/(df.iloc[:,0].var()**0.5)

    #get distance between min and max
    Changes = sum(abs(np.array(df.loc[MinimalLocation].Location)-np.array(df.loc[MaximalLocation].Location)))

    ####Now generate a statistic that finds how close on average, are the 90th percentile and above
    ####fitness to the maximum
    Percentile_90_Cutoff = (df.iloc[:,0].quantile(.90))
    #get those that pass cutoff
    CutoffPassed = df[ df.iloc[:,0]>= Percentile_90_Cutoff ]
    Distances = CutoffPassed['Location'].apply(lambda row : sum(abs(np.array(row)-np.array(df.loc[MaximalLocation].Location))))
    Average_Distance_Percentile_90=Distances.mean()

    ##Now Identify the Number of Maxima
    Number_Maxima = Count_Local_Maxima(df)

    plt.figure(figsize=(5,2))
    plt.title("Auto-correlation by step distance, N={} K={}".format(N,K),size=24)
    plt.grid()
    plt.plot(AR,color="g")
    plt.show()
    print("Max Fitness\t\t\t\t", MaximalFitness)
    print("Min Fitness\t\t\t\t", MinimalFitness)
    print("Normed difference in fitness\t\t", NormDiff)
    print("Distance btw min and max\t\t", Changes)
    print("Avg distance for 90th percentile to Max\t", Average_Distance_Percentile_90)
    print("Num of Local Maxima\t\t\t",Number_Maxima)
