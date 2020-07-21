# Conception

<DIV class="author">Author: Roy Kid | Translator: Ethan</DIV>

## image flag

If your system has a periodic boundary condition, then for a particle in the simulation box, wherever it exits the box from one of such boundaries, it will always "come back" from the other side of the boundary. So, in this case, even if it seems that the coordinate of the particle does not change after several times of this manipulation, the particle actually has a rather couple of times larger substantial displacement than the displacement in the central box. In the light of this, if we are to gather information of the realistic or substantial displacement of the particle, we have to do that by taking account of the times the particle crosses the boundary, and we call that image flag. For instance, if the particle leaves the box from the right side of the box, we add one to the image flag, and from the left side of the box, we subtract one, so on so forth. Eventually we could evaluate the substantial displacement with the information from image flag.

## neighbor list

Neighbor list is the strategy of spatial screening in the simulation. Since particles are mostly disordered in the box, for a particular particle in the system, we would only want to account for the interactions with the particles around it, or say in its neighborhood, for the sake of computational efficiency. To do that, we create a neighbor list for every particle in the system.

## ghost atom

There's two layers of neighbor list. The inner one determined by the pairwise cutoff parameter includes the particles in the proximity of the particle of interest. For the particles in this region, they are expected to mostly remain in neighbor list for the duration of the time steps until the neighbor is rebuilt by LAMMPS. On the other hand, the particles in the outer layer are in the so called "skin", where these particles are ghost atoms for the given central particle, they are on the verge of losing interaction with the central particle. With the evolvement of the time integration, if most of the ghost atoms remains in the skin, then it is acceptable to retain the current neighbor list, otherwise it would imply that significant displacements have occurred when the neighbor list need to be rebuilt at this time.

 

## dangerous build

Best case scenario, particles only move a little distance for every time step where most of the particles in the cutoff distance remains in the neighbor list whereas ghost atoms in the skin have the risk of leaving the list. Nonetheless, sometimes we set the interaction potential in a wrong way or overlapping is present or the time step is too large, in either case, the atoms within the pairwise cutoff distance in the neighbor list would have the chance to be "blow away" from the neighbor list which could result in dangerous consequence, for instance simulation be killed by the "bond atoms missing" error. One rationale is that the interaction beyond the skin would not be accounted for by LAMMPS, leading to a discontinuity of energy. In this case LAMMPS would immediately rebuild the neighbor list and warn the user, who should consider larger skin or weaker interaction or smaller time step.