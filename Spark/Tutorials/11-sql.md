
# Spark SQL and Data Frames

It is very easy to express data queries when used together with the SQL language. Moreover, Spark distributes this column-based data structure transparently, in order to make the querying process as efficient as possible.      


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

Once we have our RDD of `Row` we can infer and register the schema.  


```python
f.registerTempTable("flights")
```

Now we can run SQL queries over our data frame that has been registered as a table. Note that when using SQL, there is no need to cast DepDelay to numeric, since SQL converts Strings to numeric when applying avg().


```python
numflights = sqlContext.sql("""
    SELECT FlightNum, count(*), avg(DepDelay) as depdelay
    FROM flights GROUP BY FlightNum
""")
numflights.show(5)
```

The results of SQL queries are DataFrames which can be processed further using the DataFrame API.  


```python

```


```python

```


```python

```
