import os
import sys

from pathlib import Path
from pm4py.objects.log.importer.xes import importer as xes_importer
from pm4py.visualization.sna import visualizer as sna_visualizer
from pm4py.algo.organizational_mining.sna import util, algorithm as sna
from pm4py.algo.organizational_mining.resource_profiles import profiles
from utils import export_dictionary

# ? params: input file


# how many times an individual is followed by another individual in the execution of a business process
def handover_of_work():
    log = xes_importer.apply(sys.argv[1])
    hw_values = sna.apply(log, variant=sna.Variants.HANDOVER_LOG)
    gviz_hw_py = sna_visualizer.apply(
        hw_values, variant=sna_visualizer.Variants.PYVIS)
    sna_visualizer.view(gviz_hw_py, variant=sna_visualizer.Variants.PYVIS)


# how many times the work of an individual is interleaved by the work of some other individual, only to eventually “return” to the original individual
def subcontracting():
    log = xes_importer.apply(sys.argv[1])
    sub_values = sna.apply(log, variant=sna.Variants.SUBCONTRACTING_LOG)
    gviz_sub_py = sna_visualizer.apply(
        sub_values, variant=sna_visualizer.Variants.PYVIS)
    sna_visualizer.view(gviz_sub_py, variant=sna_visualizer.Variants.PYVIS)


# how many times two individuals work together for resolving a process instance
def working_together():
    log = xes_importer.apply(sys.argv[1])
    wt_values = sna.apply(log, variant=sna.Variants.WORKING_TOGETHER_LOG)
    gviz_wt_py = sna_visualizer.apply(
        wt_values, variant=sna_visualizer.Variants.PYVIS)
    sna_visualizer.view(gviz_wt_py, variant=sna_visualizer.Variants.PYVIS)


# how much similar is the work pattern between two individuals
def similar_activities():
    log = xes_importer.apply(sys.argv[1])
    ja_values = sna.apply(log, variant=sna.Variants.JOINTACTIVITIES_LOG)
    gviz_ja_py = sna_visualizer.apply(
        ja_values, variant=sna_visualizer.Variants.PYVIS)
    sna_visualizer.view(gviz_ja_py, variant=sna_visualizer.Variants.PYVIS)


# group the resources that are connected by a meaningful connection in the given metric
def clustering():
    log = xes_importer.apply(sys.argv[1])
    variant = sna.Variants.HANDOVER_LOG  # specify the metric here
    sa_metric = sna.apply(log, variant=variant)
    clustering = util.cluster_affinity_propagation(sa_metric)
    export_dictionary(clustering, "data/sna",
                      f"{variant.name}_clustering_{Path(sys.argv[1]).name}")


# specify the resources and the time interval
def resource_profiles():
    log = xes_importer.apply(sys.argv[1])
    start_timestamp = "2010-12-30 00:00:00"
    end_timestamp = "2011-01-25 00:00:00"
    # Metric RBI 1.1: Number of distinct activities done by a resource in a given time interval [t1, t2)
    print(profiles.distinct_activities(
        log, start_timestamp, end_timestamp, "Sara"))
    # Metric RBI 1.3: Fraction of completions of a given activity a, by a given resource r,
    # during a given time slot, [t1, t2), with respect to the total number of activity completions by resource r
    # during [t1, t2)
    print(profiles.activity_frequency(log, start_timestamp,
          end_timestamp, "Sara", "decide"))
    # Metric RBI 2.1: The number of activity instances completed by a given resource during a given time slot.
    print(profiles.activity_completions(
        log, start_timestamp, end_timestamp, "Sara"))
    # Metric RBI 2.2: The number of cases completed during a given time slot in which a given resource was involved.
    print(profiles.case_completions(
        log, start_timestamp, end_timestamp, "Pete"))
    # Metric RBI 2.3: The fraction of cases completed during a given time slot in which a given resource was involved
    # with respect to the total number of cases completed during the time slot.
    print(profiles.fraction_case_completions(
        log, start_timestamp, end_timestamp, "Pete"))
    # Metric RBI 2.4: The average number of activities started by a given resource but not completed at a moment in time.
    print(profiles.average_workload(
        log, start_timestamp, "2011-01-15 00:00:00", "Mike"))
    # Metric RBI 3.1: The fraction of active time during which a given resource is involved in more than one activity
    # with respect to the resource's active time.
    print(profiles.multitasking(
        log, start_timestamp, end_timestamp, "Mike"))
    # Metric RBI 4.3: The average duration of instances of a given activity completed during a given time slot by
    # a given resource.
    print(profiles.average_duration_activity(log, start_timestamp,
          end_timestamp, "Sue", "examine thoroughly"))
    # Metric RBI 4.4: The average duration of cases completed during a given time slot in which a given resource was involved.
    print(profiles.average_case_duration(
        log, start_timestamp, end_timestamp, "Sue"))
    # Metric RBI 5.1: The number of cases completed during a given time slot in which two given resources were involved.
    print(profiles.interaction_two_resources(
        log, start_timestamp, end_timestamp, "Mike", "Pete"))
    # Metric RBI 5.2: The fraction of resources involved in the same cases with a given resource during a given time slot
    # with respect to the total number of resources active during the time slot.
    print(profiles.social_position(
        log, start_timestamp, end_timestamp, "Sue"))


if __name__ == "__main__":
    # handover_of_work()
    # subcontracting()
    # working_together()
    # similar_activities()
    clustering()
    # resource_profiles()
