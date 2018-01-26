
# DataFrame

Spark 1.0 provided RDDs as its sole data API, supporting transformations and actions that can be used to control how the data is processed in a pipeline. The main advantage of RDDs is that they are simple and well understood because they deal with concrete classes, providing a familiar object-oriented programming style. 

The main disadvantage to RDDs is that they don’t perform particularly well. RDDs serialize all individual object which causes overhead. Other disadvantages are that the code that uses RDD can become less clear in the absense of concrete labels for columns, the use of RDDs demands lower level coding compared to more declarative languages (e.g. SQL), and external libraries rarely provide direct support for RDDs.

In Spark 1.3 DataFrames are supported, which allow for faster processing by allowing objects to be kept in memory instead of serializing everything to disk for every step. DataFrames are the data structure that is used by the very well supported `pandas` library, allowing to use external libraries that support pandas DataFrame in Spark. DataFrames provide a more table-like perspective on data, that can be operated with its own API or declarative languages such as SQL. The engine translates SQL queries to DataFrame operations, therefore, most SQL queries are as efficient as their DataFrame equivalent. 


```python
data = sc.parallelize([('M', 25), 
                       ('M', 20), 
                       ('M', 30), 
                       ('F', 25),
                       ('F', 20),
                       ('M', 30)])
```

Creating a DataFrame requires a dataset (e.g. RDD, List), and to provide a schema. In the most simple case, Spark will infer the correct datatypes from the dataset, so only the names for the columns are required.

Alternatively, data can also be read directly into DataFrames, for instance by using `pandas` or `parquet`.


```python
df = spark.createDataFrame(data, ['gender', 'age'])
print("The structure of the dataframe is {}".format(df))
#show the result of the dataframe
df.show()
print("the number of rows in the dataframe is {}".format(df.count()))
```

    The structure of the dataframe is DataFrame[gender: string, age: bigint]
    +------+---+
    |gender|age|
    +------+---+
    |     M| 25|
    |     M| 20|
    |     M| 30|
    |     F| 25|
    |     F| 20|
    |     M| 30|
    +------+---+
    
    the number of rows in the dataframe is 6


Different from RDDs, the columns are labelled which allows for clear code.


```python
df.filter(df.gender == 'M').show()
```

    +------+---+
    |gender|age|
    +------+---+
    |     M| 25|
    |     M| 20|
    |     M| 30|
    |     M| 30|
    +------+---+
    



```python
df.groupBy(df.gender).count().show()
```

    +------+-----+
    |gender|count|
    +------+-----+
    |     F|    2|
    |     M|    4|
    +------+-----+
    



```python
df.groupBy(df.gender).max("age").show()
```

    +------+--------+
    |gender|max(age)|
    +------+--------+
    |     F|      25|
    |     M|      30|
    +------+--------+
    



```python
from pyspark.sql.functions import *
df1 = df.groupBy(df.gender)
df1.agg(sum("age").alias("total"), min("age"), max("age")).show()
```

    +------+-----+--------+--------+
    |gender|total|min(age)|max(age)|
    +------+-----+--------+--------+
    |     F|   45|      20|      25|
    |     M|  105|      20|      30|
    +------+-----+--------+--------+
    


### Reading a .csv file into a DataFrame

For some file formats (e.g. .csv), there are also readers that can read the data directly as DataFrame. In this example, we will use a dataset with airline on-time statistics and delay causes. 


```python
filename = '2008.csv.bz2'
if not os.path.exists(filename):
    import urllib.request
    urllib.request.urlretrieve ("http://stat-computing.org/dataexpo/2009/2008.csv.bz2", \
                                filename)
```

### DataFrame schema

A DataFrame has a schema that consists of the column names and data types (and some optional information like if Null is allowed). In a .csv file, the column names are usually given by a header in the file, but the data type is usually not given. We will use three ways to assign a DataFrame to a schema.

### (a) Infer schema

The easiest option is to use the spark.csv reader. It can use the column labels that are in the file, and has an inferSchema option that infers the datatypes from the data. However, inferSchema has two disadvantages: (1) it is a very expensive operation for large data volumes (will go over the entire dataset), (2) it is not perfect, often datatypes are set to String or Object when there are missing values.


```python
f = sqlContext.read.format("com.databricks.spark.csv").\
    options(header="true", inferSchema = "true", ).load(filename)
f.printSchema()
```

    root
     |-- Year: integer (nullable = true)
     |-- Month: integer (nullable = true)
     |-- DayofMonth: integer (nullable = true)
     |-- DayOfWeek: integer (nullable = true)
     |-- DepTime: string (nullable = true)
     |-- CRSDepTime: integer (nullable = true)
     |-- ArrTime: string (nullable = true)
     |-- CRSArrTime: integer (nullable = true)
     |-- UniqueCarrier: string (nullable = true)
     |-- FlightNum: integer (nullable = true)
     |-- TailNum: string (nullable = true)
     |-- ActualElapsedTime: string (nullable = true)
     |-- CRSElapsedTime: string (nullable = true)
     |-- AirTime: string (nullable = true)
     |-- ArrDelay: string (nullable = true)
     |-- DepDelay: string (nullable = true)
     |-- Origin: string (nullable = true)
     |-- Dest: string (nullable = true)
     |-- Distance: integer (nullable = true)
     |-- TaxiIn: string (nullable = true)
     |-- TaxiOut: string (nullable = true)
     |-- Cancelled: integer (nullable = true)
     |-- CancellationCode: string (nullable = true)
     |-- Diverted: integer (nullable = true)
     |-- CarrierDelay: string (nullable = true)
     |-- WeatherDelay: string (nullable = true)
     |-- NASDelay: string (nullable = true)
     |-- SecurityDelay: string (nullable = true)
     |-- LateAircraftDelay: string (nullable = true)
    


Similar to RDD's, we can perform a `count` on a DataFrame to get the number of row. Notice that this already may take some time on small computers.


```python
f.count()
```

lternatively you can manually specify the schema, but in this tutorial, we will stick with inferSchema. 

### (b) Casting values

Now we have a dataframe, we would like to compute the the average delays for departure and arrival per flight number. However, notice that inferschema sometimes guesses wrong: e.g. DepDelay and ArrDelay should be double instead of String. 

Also compute these statistics efficiently, we do not need the entire dataframe, but just a few columns. If we do not leave out the other columns, much more data is processed than necessary.


```python
from pyspark.sql.types import *

delays = f.select(  f.FlightNum.cast(IntegerType()), 
                                f.DepDelay.cast(DoubleType()),
                                f.ArrDelay.cast(DoubleType()))
delays.printSchema()
```

### (c) Providing a schema

Alternatively you can manually specify the schema. For this we will first extract the first line of the file, which contains the headers.


```python
from bz2 import BZ2File as bzopen
with bzopen(filename) as fin:
    header = fin.readline().decode('utf-8')
header
```

Now we remove the \n and split on ',' to get the column names.


```python
columns = header.strip().split(',')
columns[:10]
```

In this very short example, we will assume that all columns are Strings except for the ones that we modify. To create a schema, we eventually need an ordered List of StructField's. However, to change a few fields, it is easier to setup a dictionary to make the changes and then convert it into an ordered list.


```python
from pyspark.sql.types import *

# maps a StringType structfield to each column name
fields = {column:StructField(column, StringType()) for column in columns}

# change the two delays to IntType
fields['ArrDelay'] = StructField('ArrDelay', IntegerType())
fields['DepDelay'] = StructField('DepDelay', IntegerType())

# change the dictinary to an ordered list
fields = [fields[column] for column in columns]
# and construct a schema from the fields
schema = StructType(fields)

# lets inspect the schema, ArrDelay and DepDelay should be IntegerType
schema

```

Read the file as a DataFrame using the given schema. The csv reader will automatically decompress bz2. You should see that for large files, providing a schema is much faster than inferring a schema. It is also much cleaner than reading everything as a string and casting all types (although, for accessing a single column casting is much more convenient).


```python
delays = spark.read.csv(filename, header=True, schema=schema)
delays
```

Internally, every row in de DataFrame is modelled as a *Row* object that contains a dictionary of values.


```python
delays.take(5)
```

And together with the schema, show presents the data as a readable table (provided a monospaced font is used).


```python
delays.show(5)
```

We can reduce the columns in the dataframe by using `select` with a list of columns. A column can either be addressed by its name, or as a property of the dataframe. Reducing the columns in a DataFrame may improve efficiency, since less data is processed.


```python
delays1 = delays.select(delays.FlightNum, delays.ArrDelay, delays.DepDelay)
delays1.printSchema()
delays1.show(5)
```

Tests show that in general DataFrames are quite a bit faster than RDD's. However, the API for DataFrame is declarative, meaning that we describe how we want our data to look (like in SQL) rather than describing how to transform the data (like RDD's). This declarative API does not directly support lambda functions to process elements. However, in the background, RDD's are still used to process the data, so the code is still lazy executed, e.g. the next example will terminate after the first 5 matches are found. 


```python
delays1.filter(delays.FlightNum == 335).show(5)
```

The `select()` transformation can be used to apply expressions to columns, and `alias()` to name the resulting columns. 


```python
delays1.select(delays1.FlightNum, (delays1.ArrDelay - delays1.DepDelay).alias('diff')).show(5)
```

Spark DataFrames also have an SQL like syntax for expressions. Instead of `delays.DepDelay` we can also give the column name `'DepDelay'` which is resolved by looking up the column with that name in the DataFrame. Spark creates new column objects when a new DataFrame is created, and these columns do not always correspond to the original columns. In the example below the groupBy causes new columns to be created, and therefore `delays.DepDelay` would not work and `'DepDelays'` does.


```python
delays1.groupBy( delays1.FlightNum).avg( 'DepDelay', 'ArrDelay').show(5)
```

To perform more complex aggregation functions you can call the generic `agg` tranformation on a DataFrame. Additionally, the `sql.functions` libraray supplies standard functions you can use, e.g. sum, max, count, mean.


```python
from pyspark.sql.functions import *

fg = delays1.groupBy(delays.FlightNum)
fg = fg.agg(mean(delays1.ArrDelay - delays1.DepDelay), mean("ArrDelay"))
fg.show(5)
```

Although functions cannot be used by mapping them to elements in the same way as with RDD's, we can create a User Defined Function (UDF) based on a function and use that. For this, `udf` must be imported from `spark.sql.functions` which we already did above.

One catch with udf's is that they return a String by default, converting the output value in the process. We can prevent the `udf` from returning a String by specifying a return type.

NB Spark also has User Defined Aggregate Functions (UDAF), but currently these cannot currently be used from Python (you have to write it in Scala or Java). 


```python
diff = udf(lambda x, y: x - y, DoubleType())

# filter out empty cells
delaysnn = delays.filter(delays.ArrDelay.isNotNull()).filter(delays.DepDelay.isNotNull())
delaysnn.select(delays.FlightNum, diff(delays.ArrDelay, delays.DepDelay)).show(5)
```

## DataFrame to RDD ##

For some operations, RDD provides a more convenient API than DataFrames. For example, to take the 5 longest departure delays for each flight is very hard to do with DataFrames, since there is no standard function in the DataFrame API and no way to group and flatten data. However, we can also use RDD functions by simply converting a DataFrame to an RDD.

Working with RDD's becomes easier when the data has a (key, value) structure. We can prepare that by selecting just the flight number and departure delay. We need to filter out the empty cells. Converting the DataFrame to RDD is as simple as accessing the rdd property of the DataFrame. When we inspect the RDD format, we would see that every element is a DataFrame `Row` object, however, these work just the same as any other tuple. We group the by the key, and can then sort the departure delays per group and take the last 5. We can also flatten the structure so that we get single (FligtNum, DepDelay) elements in one go by using `flatMapValues` instead of `mapValues`.


```python
depdelays = delays.select(delays.FlightNum, delays.DepDelay)
depdelays = depdelays.filter(depdelays.DepDelay.isNotNull())
delaysrdd = depdelays.rdd
delaysrdd = delaysrdd.groupByKey().\
                      mapValues(lambda x : sorted(x)[-5:])
delaysrdd.take(5)
```


```python

```
