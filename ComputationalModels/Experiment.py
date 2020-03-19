


##Import packages and files
from itertools import compress, product
import numpy as np
import matplotlib.pyplot as plt
import array
import random
import pandas as pd
import itertools
import operator
import importlib
#import functions defining the layered landscape
from LayeredLandscapeFunctions import *
from Landscapes import *
#import networkx as nx



def Make_Lon(DF_Landscape, M, D, Num_Perturbs):

    ##First get a list of all the Maxima locations
    DFMaximas = DF_Landscape[DF_Landscape.Maxima==1].index.values
    df = pd.DataFrame(data=None, index=DF_Landscape[DF_Landscape.Maxima==1].index.values, columns=DF_Landscape[DF_Landscape.Maxima==1].index.values,
                 dtype=None, copy=False)
    df = df.fillna(0) #replace nas with zeros

    #loop through every maxima
    for Maxima in DFMaximas:
        s_star=Maxima #set currrent s_star
        i=0
        while(i<Num_Perturbs):
            s_prime = Perturbation(s_star, D) #perturb
            s_prime_star = Hill_Climb_First(s_prime,DF_Landscape, M)  #climb new hill, here find first maxima
            #update the transition matrix
            df.at[s_star, s_prime_star] =  df.at[s_star, s_prime_star]+1

            i = i + 1
    return(df)



for params in [(10,3),(10,8), (15,3), (15,10)]:
    print("starting ", params, "at", datetime.datetime.now())

    N = params[0]
    K = params[1]
    ##First define a landscape, then notice all the maximas (it prinds the number of maxima)

    for I in range(5):
        NKLand1 = make_NK_land(N=N,K=K)
        DFWithMaximas = Local_Maxima_Locations(NKLand1)


        LONMatrix = Make_Lon(DFWithMaximas,M = 1,D = 2,Num_Perturbs = 500)

        with open("N-{}_K={}_I={}.csv".format(N,K,I), "w") as f:
            f.write(LONMatrix.to_csv())
     print("ended at", datetime.datetime.now())

for params in [[10,0,8]], [15,0,10]]:
    print("starting ", params, "at", datetime.datetime.now())


    N = params[0]
    K1= params[1]
    K2 = params[2]
    ##First define a landscape, then notice all the maximas (it prinds the number of maxima)

    for I in range(5):
        NKLand1 = make_NK_land(N=N,K=K1)
        NKLand2 = make_NK_land(N=N,K=K2)
        layered_land = layer_landscapes(NKLand1,NKLand2)
        DFWithMaximas = Local_Maxima_Locations(layered_land)


        LONMatrix = Make_Lon(DFWithMaximas,M = 1,D = 2,Num_Perturbs = 500)

        with open("N-{}_K1={}_K2={}_I={}.csv".format(N,K1,K2,I), "w") as f:
            f.write(LONMatrix.to_csv())
    print("ended at ", datetime.datetime.now())
