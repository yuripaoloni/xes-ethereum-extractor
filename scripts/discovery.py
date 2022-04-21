import sys

from pm4py.algo.discovery.inductive import algorithm as inductive_miner
from pm4py.objects.log.importer.xes import importer as xes_importer
from pm4py.objects.conversion.process_tree import converter as pt_converter
from pm4py.visualization.process_tree import visualizer as pt_visualizer
from pm4py.visualization.petri_net import visualizer as pn_visualizer

# XES file
file_path = sys.argv[1]

# import xes log
log = xes_importer.apply(file_path)

# process tree
tree = inductive_miner.apply_tree(log)

# petri net
net, initial_marking, final_marking = pt_converter.apply(
    tree, variant=pt_converter.Variants.TO_PETRI_NET)

# petri net visualizer
gviz = pn_visualizer.apply(net, initial_marking, final_marking)
pn_visualizer.view(gviz)

# process tree visualizer
gviz = pt_visualizer.apply(tree)
pt_visualizer.view(gviz)
