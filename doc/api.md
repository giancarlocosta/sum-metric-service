Metric Service API
==================
<br/><br/><br/>
# **METRIC**<br/>

<br/>
### /metric/{key}/sum
---
## ***GET***
**Description:** Returns the sum of all metrics reported for this key over the past hour.

**Parameters**

| Name | Located in | Required | Schema | Description |
| ---- | ---------- | -------- | ------ | ----------- |
| key | path | Yes | string | Key/id of metric to fetch |

**Responses**

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Success. Sum in response body. | object |
| 404 | NotFoundError | [Error](#error) |

**Response Example:** 

```
{
   "value": 14
}
```
<br/>
### /metric/{key}
---
## ***POST***
**Description:** Log a metric.

**Parameters**

| Name | Located in | Required | Schema | Description |
| ---- | ---------- | -------- | ------ | ----------- |
| body | body | Yes | object | Metric body (only "value" for now) |

**Request Example:** 

```
{
   "value": 2
}
```
**Responses**

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Success. | object |
| 400 | InvalidError | [Error](#error) |

**Response Example:** 

```
{}
```
<br/><br/>
# **MODELS**
---
## <a name="metric"></a>**metric**  
The Metric type schema.

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| value | integer | Yes | Quantity for this metric. |
## <a name="error"></a>**Error**  


| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| statusCode | integer | Yes | HTTP Error code |
| name | string | Yes | Name of the error |
| message | string | No | Basic error message |
| details | string | No | Additional error details |
| code | integer | No | Sub error code (for different errors that must share same HTTP code) |

# **ERRORS**


##### InvalidError


```

{
   "name": "InvalidError",
   "message": "Request was invalid.",
   "statusCode": 400,
   "code": 4000
}

```


##### UnauthorizedError


```

{
   "name": "UnauthorizedError",
   "message": "User not authorized.",
   "statusCode": 401,
   "code": 4010
}

```


##### ForbiddenError


```

{
   "name": "ForbiddenError",
   "message": "User not authorized.",
   "statusCode": 403,
   "code": 4030
}

```


##### NotFoundError


```

{
   "name": "NotFoundError",
   "message": "Resource in request not found.",
   "statusCode": 404,
   "code": 4040
}

```


##### SpecificResourceNotFoundError


```

{
   "name": "SpecificResourceNotFoundError",
   "message": "Specific Resource not found.",
   "statusCode": 404,
   "code": 4041
}

```


##### ReferenceNotFoundError


```

{
   "name": "ReferenceNotFoundError",
   "message": "Referenced object not found.",
   "statusCode": 404,
   "code": 4042
}

```


##### AlreadyExistsError


```

{
   "name": "AlreadyExistsError",
   "message": "Resource already exists",
   "statusCode": 409,
   "code": 4091
}

```

