
## Making plots from data

There are several good libraries you can use to generate plots from the data you process with Spark. In this tutorial we will use `Plot.ly`, but there are many alternative libraries you can use, e.g. `matplotlib`, `pyplot`, `Pandas`.

First we load some data, and derive averages we want to visualize in a plot.


```python
filename = '2008.csv.bz2'
if not os.path.exists(filename):
    import urllib.request
    urllib.request.urlretrieve ("http://stat-computing.org/dataexpo/2009/2008.csv.bz2", \
                                filename)
```


```python
f = sqlContext.read.format("com.databricks.spark.csv").\
    options(header="true", inferSchema = "true").load(filename)
```


```python
from pyspark.sql.functions import *

averagedelays = f.groupBy(f.FlightNum).\
agg(avg("DepDelay"), avg("ArrDelay"))
averagedelays.show(2)
```

## Plotting the data

Here we use plotly.offline, there is also an online variant for which you need a free registration, which allows you to share your plots in the cloud. The second import statement imports all graph classes, including `Histogram` which prepares the given data points `x` by dividing the x-axis into a number of buckets, and then counts the number of data points that fall into each bucket. The y-axis in the histogram represents the number of flights that was delayed by the amount of time on the x-axis. The `data` series must be entered into a list, even if you have only one data serie. 


```python
import plotly.offline as py
from plotly.graph_objs import *
py.init_notebook_mode()
data = [
    Histogram(x=averagedelays.toPandas()["avg(DepDelay)"])
    ]
```


```python
py.iplot(data)
```

In the next example, `data` contains two series, one for Departure Delay and one for Arrival Delay. For visibility, the bins are fixed to size=2 to prevent the bars from overlapping.


```python
data = [
        Histogram(x=averagedelays.toPandas()["avg(DepDelay)"], 
                  xbins=dict(start=0, end=100, size=2)),
        Histogram(x=averagedelays.toPandas()["avg(ArrDelay)"], 
                  xbins=dict(start=0, end=100, size=2))
    ]
py.iplot(data)
```

To add a derived column to a DataFrame, often and UserDefinedFunction (UDF) is needed, since these are not evaluated straight away, but rather when called with an element.


```python
from pyspark.sql.types import *

addFlight = udf(lambda x: 'flight ' + str(x), returnType=StringType())

flightdelays = averagedelays.withColumn("Flight", addFlight('FlightNum'))

```


```python
data = [ 
    Scatter(x=flightdelays.toPandas()["avg(DepDelay)"],
            y=flightdelays.toPandas()["avg(ArrDelay)"],
            marker=Marker(size=2 + flightdelays.toPandas()["avg(ArrDelay)"] / 10),
            text=flightdelays.toPandas()["Flight"],
            mode='markers'
    )]
py.iplot(data)
```


```python

```


```python

```
