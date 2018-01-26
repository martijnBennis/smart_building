
## JSON

In the example below, the data from a JSon file is read directly as a DataFrame.


```python
from pyspark.sql.types import *
from pyspark.sql.functions import *
```


```python
filename = 'nobelprize.json'
if not os.path.exists(filename):
    import urllib.request
    url = 'http://api.nobelprize.org/v1/prize.json'
    f = urllib.request.urlretrieve (url, filename)
```

Often JSON files have a single root containing multiple records as an array. Inconveniently, `printSchema` shows the name `root` while the actual name in the data is `prizes`. We can `flatten` the data so that instead of one entry that consists of an array, every prize becomes a separate entry.


```python
df = sqlContext.read.json(filename)
prizes = df.select(explode("prizes")).selectExpr("col as prize")
```

We can inspect the schema of the DataFrame


```python
prizes.printSchema()
```

    root
     |-- prize: struct (nullable = true)
     |    |-- category: string (nullable = true)
     |    |-- laureates: array (nullable = true)
     |    |    |-- element: struct (containsNull = true)
     |    |    |    |-- firstname: string (nullable = true)
     |    |    |    |-- id: string (nullable = true)
     |    |    |    |-- motivation: string (nullable = true)
     |    |    |    |-- share: string (nullable = true)
     |    |    |    |-- surname: string (nullable = true)
     |    |-- overallMotivation: string (nullable = true)
     |    |-- year: string (nullable = true)
    


And store the DataFrame so that we can query it using spark.sql.


```python
prizes.createOrReplaceTempView("prizes")
```

Note that in this JSon file year is inferred as a String, therefore, if we want to use numeric expressions on year we need to convert it to int.


```python
sqlDF = spark.sql("select prize.category, int(prize.year) + 1\
                   as year from prizes")
```


```python
sqlDF.show(8)
```

### use a selectExpr to cast values ###
However, when we use SQL functions, values are automatically cast to their required type.


```python
sqlDF.selectExpr("year * 2 as y", "year - 2 as x").show(7)
```

Every prize can have an array of laureates. If we want to process every indivual laureate, we can use explode to duplicate the prize entries for every laureate.


```python
flatPrizes = prizes.select(prizes['prize.year'],\
                           prizes['prize.category'], \
                           explode(prizes['prize.laureates']).alias('l'))
flatterPrizes = flatPrizes.select(flatPrizes['year'],\
                                  flatPrizes['category'],
                                  flatPrizes['l.id'].alias('pid'),
                                  flatPrizes['l.firstname'],
                                  flatPrizes['l.surname'],
                                  flatPrizes['l.motivation'])
flatterPrizes.createOrReplaceTempView("laureates")
flatterPrizes.show(5)
```


```python
spark.sql("select category, year, surname from laureates").show(6)
```


```python

```


```python

```
