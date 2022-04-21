import sys

from pm4py.algo.discovery.inductive import algorithm as inductive_miner
from pm4py.objects.log.importer.xes import importer as xes_importer
from pm4py.objects.conversion.process_tree import converter as pt_converter
from pm4py.visualization.process_tree import visualizer as pt_visualizer
from pm4py.visualization.petri_net import visualizer as pn_visualizer
from pm4py.visualization.bpmn import visualizer as bpmn_visualizer

# XES file
file_path = sys.argv[1]

# import xes log
log = xes_importer.apply(file_path)

# process tree
tree = inductive_miner.apply_tree(log)

# petri net
net, initial_marking, final_marking = pt_converter.apply(
    tree, variant=pt_converter.Variants.TO_PETRI_NET)

# bpmn model
bpmn_model = pt_converter.apply(tree, variant=pt_converter.Variants.TO_BPMN)

# petri net visualizer
pn_gviz = pn_visualizer.apply(net, initial_marking, final_marking)
pn_visualizer.view(pn_gviz)

# process tree visualizer
pt_gviz = pt_visualizer.apply(tree)
pt_visualizer.view(pt_gviz)

# bpmn visualizer
bpmn_gviz = bpmn_visualizer.apply(bpmn_model)
bpmn_visualizer.view(bpmn_gviz)
