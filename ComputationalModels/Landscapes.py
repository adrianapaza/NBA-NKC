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

def Position_rand(N):
    Pos = (np.random.rand(N)>0.5).astype(int)
    Pos = Pos.astype(int)
    return(Pos)

def make_NK_land(N, K):
    return Fitness_Mapping(np.random.rand(N, 2**(K+1)))




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



def layer_landscapes(Landscape1, Landscape2, layering_mode="addition", weights=None):


    if layering_mode == "average":
        assert weights != None, "You need to provide weights for the average"
        Landscape1.Fitness = ((Landscape1.Fitness*weights[0])+(Landscape2.Fitness*weights[1]))
        return Landscape1

    if layering_mode == "addition": #really for the Dirichlet landscape, which has a different mass
        Landscape1.Fitness = Landscape1.Fitness + Landscape2.Fitness
        return Landscape1

    if layering_mode == "multiplication":
        Landscape1.Fitness = (Landscape1.Fitness+.5) * (Landscape2.Fitness + .5)
        return Landscape1

def sorted_from_NK(landscape):
    df = landscape.sort_values(by="Fitness")
    fitnesses = list(df.Fitness)

    N = len(df.iloc[0]["Location"])
    hypercube = nx.hypercube_graph(N)
    chosen_peak = tuple((np.random.rand(N)>0.5).astype(int))

    node_dict = nx.shortest_path_length(hypercube, chosen_peak)
    distance_dict = defaultdict(list)
    max_dist = 0
    for key, dist in node_dict.items():
        distance_dict[dist].append(key)
        if dist > max_dist:
            max_dist = dist

    sorted_landscape = {}
    sorted_landscape["".join([str(i) for i in chosen_peak])] = (fitnesses.pop(),chosen_peak)

    for dist in range(1,max_dist+1): # node_dict has zero key...so weird IMHO
        for location in distance_dict[dist]:
            sorted_landscape["".join([str(i) for i in location])] = (fitnesses.pop(),location)

    return pd.DataFrame.from_dict(sorted_landscape,orient="index",columns=["Fitness","Location"])

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
This is used in later functions
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
SEARCH ALGORITHMS

Hill Climb will take a given position then look at neighbors to find next highest one if not at maxima.
#One finds the maxima of all your neighobrs when taking a step, and the other finds the first highest neighbor.

"""
def Hill_Climb_To_Max(Position,df, M):
    #Loops until you reach a maxima
    while df.loc[str(Position)].Maxima==0:

        #Identify the Neighbors (distance of M from initial position row)
        Neighbors = df[df['Location'].apply(lambda row : sum(abs(np.array(row)-np.array(df.loc[str(Position)].Location)))==M)]        #Get the maximum fitness value of the neighbors

        Neighbors_Max = max(Neighbors.Fitness) #fitness is indexed at 0 here for some reason
            ##Find the highest neighbor, then go to it
        if Neighbors_Max > df.loc[str(Position)].Fitness: #fitness is indexed at 1 here for some reason
            Position = Neighbors['Fitness'].idxmax()

    return Position

def Hill_Climb_First(Position,df, M):
        #Loops until you reach a maxima
    #loop until no better neighbors
    num_better_neighbors = 0
    while num_better_neighbors>0:

        #Identify the Neighbors (distance of M from initial position row)
        Neighbors = df[df['Location'].apply(lambda row : sum(abs(np.array(row)-np.array(df.loc[str(Position)].Location)))==M)]        #Get the maximum fitness value of the neighbors

        BetterNeighbors = Neighbors[Neighbors.Fitness>df.loc[str(Position)].Fitness]
        #randomize order of neighobrs then loop until one exceeds
        if len(BetterNeighbors)>0: #only update if there exists at least one superior neighobr
            BetterNeighbors.sample(frac=1)
            Position = BetterNeighbors.index.values[0] #return the first index value
        num_better_neighbors=len(BetterNeighbors)

    return Position
 
    
"""
Perturbation

Given a position, perturb by some amount D

"""
def Perturbation(Position,D):
    Position = np.array(list(str(Position)))

    N=len(Position)
    s = list(range(N))
    random.shuffle(s)
       #Take a step by picking a random gene to change
    first_sample = s[-D:]
    for i in first_sample:
        Position[i] = abs(int(Position[i])-1)
    return(''.join(Position))


'''
MARKOV CLUSTERING FUNCTIONS
'''
##first prepare a LON transition matrix dataframe
def PrepLonMatrix(LON):
    Transition_Matrix_New_Transpose=LON.transpose() #transpose
    TNumpy = Transition_Matrix_New_Transpose.to_numpy() #to numpy
    TNumpy = np.nan_to_num(TNumpy) #replace na
    return(TNumpy)


## Expansion Power
EXPANSION_POWER = 2
## Inflation power and number of iterations 
# iterations really should not be preset and should be coded as stopping at convergence)
INFLATION_POWER = 2
#ITERATION_COUNT = 40
def normalize(matrix):
    return matrix/np.sum(matrix, axis=0)

def expand(matrix, power):
    return matrix**power

def inflate(matrix, power):
    for entry in np.nditer(matrix, op_flags=['readwrite']):
        #print(entry)
        entry[...] = entry**power
        #print(entry)
    return matrix

def Markov_Clustering(matrix):
    matrix = PrepLonMatrix(matrix)
    matrix = normalize(matrix)

    OldMatrix = np.zeros((len(matrix),len(matrix)))
    #keep looping until convergence
    while ((matrix == OldMatrix).all())==False:
        OldMatrix = matrix
        matrix = normalize(inflate(expand(matrix, EXPANSION_POWER), INFLATION_POWER))
        matrix = np.nan_to_num(matrix)
        #print((OldMatrix-matrix).sum())
    return matrix



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
    #print(FitnessMap.loc["".join([str(i) for i in currPosition])])
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
    fitness_dict = {}
    for focal_row in df.itertuples():
        source_fit = focal_row.Fitness
        Neighbors = df[df['Location'].apply(lambda row : sum(abs(np.array(row)-np.array(focal_row.Location)))==1)]
        fitness_dict[focal_row.Location]= source_fit
        for neighbor in Neighbors.itertuples():
            fitness_diff_dict[(focal_row.Location,neighbor.Location)] = (source_fit-neighbor.Fitness) #

    nx.set_node_attributes(hypercube,fitness_dict, "fitness")
    nx.set_edge_attributes(hypercube, fitness_diff_dict,"fitness_difference")

    return hypercube

def landscape_as_digraph(df):

    N=len(df.iloc[0].name)
    hypercube = nx.hypercube_graph(N)

    digraph  = nx.DiGraph()
    digraph.add_nodes_from(hypercube.nodes())

    fitness_diff_dict = {}
    fitness_dict = {}
    for focal_row in df.itertuples():
        source_fit = focal_row.Fitness
        Neighbors = df[df['Location'].apply(lambda row : sum(abs(np.array(row)-np.array(focal_row.Location)))==1)]
        fitness_dict[focal_row.Location]= source_fit
        for neighbor in Neighbors.itertuples():
            fitness_diff_dict[(focal_row.Location,neighbor.Location)] = 1+source_fit-neighbor.Fitness
            fitness_diff_dict[(neighbor.Location,focal_row.Location)] = 1+neighbor.Fitness-source_fit

    nx.set_node_attributes(digraph,fitness_dict, "fitness")
    nx.set_edge_attributes(digraph, fitness_diff_dict,"fitness_difference")

    return digraph


"""
LANDSCAPE MEASUREMENTS

A bunch of different ways for comparing landscapes or walks over them
"""

# Gets the autocorrelation of the series of fitnesses obtained from a random walk.
def Get_AR(TimeData, lag_range):
    #convert to time series\
    s = pd.Series(TimeData)

    return [s.autocorr(lag=r) for r in range(lag_range)]


"""

Returns the dataframe with a column variable indicating (1) if the location is a local maxima
"""

def Local_Maxima_Locations(df):
    #Set A Maxima counter
    Num_Local_Max=0
    df['Maxima']=0
    #Loop over all rows
    for idx, focal_row in df.iterrows():
        #Identify the Neighbors (distance of 1 from focal row)
        Neighbors = df[df['Location'].apply(lambda row : sum(abs(np.array(row)-np.array(focal_row.Location)))==1)]        #Get the maximum fitness value of the neighbors
        Neighbors_Max = max(Neighbors.Fitness) #fitness is indexed at 0 here for some reason

        ##See if the neighbors max does not exceed the focal max, if not then it is a local maxima
        if Neighbors_Max < focal_row.Fitness: #fitness is indexed at 1 here for some reason
            df.loc[idx,'Maxima'] = 1
            #print('Local Maxima found')
            Num_Local_Max += 1
        #Append the focal row at the end
    print(Num_Local_Max)
    return df

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

def path_lengths(landscape,cutoff):

    max_ind = landscape.iloc[:,0].idxmax()
    max_loc = landscape.loc[max_ind].Location
    max_fit = landscape.loc[max_ind].Fitness
    min_ind = landscape.iloc[:,0].idxmin()
    min_loc = landscape.loc[min_ind].Location
    min_fit = landscape.loc[min_ind].Fitness
    fit_diff = max_fit-min_fit

    graph = landscape_as_graph(landscape)
    fitness_by_edge = {}
    for i, j, k in list(graph.edges.data()):
        fit = k["fitness_difference"]
        fitness_by_edge[(i,j)] = fit
        fitness_by_edge[(j,i)] = fit
    total_lengths = []
    #cutoff = .5*len(list(graph.nodes()))
    for path in nx.all_simple_paths(graph, max_loc, min_loc,cutoff=cutoff):
        cum_len = 0
        path_length = len(path)
        for i in range(0,path_length-1):
            cum_len += fitness_by_edge[(path[i],path[i+1])]
        total_lengths.append(cum_len)
    #print(fit_diff)
    #print(total_lengths)
    positive = sum([1 if i<=fit_diff else 0 for i in total_lengths])
    #print(positive)

    print("Difference btw min and max fitness", fit_diff)
    print("Number of paths a weight equal to the difference (e.g. positive paths):",positive)
    print("Percentage positive paths", positive/len(total_lengths))
    plt.hist(total_lengths)
    plt.show()
    return total_lengths
