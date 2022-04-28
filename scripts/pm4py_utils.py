import sys

from pm4py.objects.log.importer.xes import importer as xes_importer
from pm4py.algo.filtering.log.attributes import attributes_filter
from pm4py.algo.filtering.log.start_activities import start_activities_filter
from pm4py.statistics.traces.generic.log import case_statistics
from pm4py.visualization.graphs import visualizer as graphs_visualizer
from pm4py import view_dotted_chart, view_events_distribution_graph

from utils import export_dictionary


# get variants list and their respective count
def get_variants_list(outputFileName):
    log = xes_importer.apply(sys.argv[1])
    variants_count = case_statistics.get_variant_statistics(log)
    variants_count = sorted(
        variants_countkey=lambda x: x['count'], reverse=True)
    export_dictionary(variants_count, outputFileName)


# get start activities list and their respective count
def get_start_activities(outputFileName):
    log = xes_importer.apply(sys.argv[1])
    start_activities_count = start_activities_filter.get_start_activities(log)
    start_activities_count = sorted(
        start_activities_count.items(), key=lambda x: x[1],  reverse=True)
    sorted_start_activities_count = {k: v for k, v in start_activities_count}
    export_dictionary(sorted_start_activities_count, outputFileName)


# get the distribution of events over time. it helps to understand in which time intervals the greatest number of events is recorded
def get_plot_events_distribution_over_time():
    log = xes_importer.apply(sys.argv[1])

    x, y = attributes_filter.get_kde_date_attribute(
        log, attribute="time:timestamp")

    gviz = graphs_visualizer.apply_plot(
        x, y, variant=graphs_visualizer.Variants.DATES)
    graphs_visualizer.view(gviz)

# charts for distribution of events over time. distr_type can be: hours, days_week, days_month, months, years.


def get_chart_events_distribution_over_time(distr_type):
    log = xes_importer.apply(sys.argv[1])
    view_events_distribution_graph(log, distr_type, format="png")


# dotted chart is a classic visualization of the events inside an event log across different dimensions (X, Y, colors).
# Each event of the event log is corresponding to a point
def get_dotted_chart():
    log = xes_importer.apply(sys.argv[1])
    view_dotted_chart(log, format="png", attributes=[
                      "case:concept:name", "time:timestamp", "concept:name"])


if __name__ == "__main__":
    # get_variants_list("full_land_proxy_variants")
    # get_start_activities("full_land_proxy_start_activities")
    # get_plot_events_distribution_over_time()
    get_chart_events_distribution_over_time("days_week")
    # get_dotted_chart()
