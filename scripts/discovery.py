import sys

from pm4py.algo.discovery.inductive import algorithm as inductive_miner
from pm4py.objects.log.importer.xes import importer as xes_importer
from pm4py.objects.conversion.process_tree import converter as pt_converter
from pm4py.visualization.bpmn import visualizer as bpmn_visualizer

# ? params: input file

# XES file
file_path = sys.argv[1]

# import xes log
log = xes_importer.apply(file_path)

# process tree - variants can be IM, IMf (NOISE_THRESHOLD param can be setted), IMd
tree = inductive_miner.apply_tree(
    log, variant=inductive_miner.Variants.IMd)

# bpmn model
bpmn_model = pt_converter.apply(tree, variant=pt_converter.Variants.TO_BPMN)

# bpmn visualizer
bpmn_gviz = bpmn_visualizer.apply(bpmn_model)
bpmn_visualizer.view(bpmn_gviz)
