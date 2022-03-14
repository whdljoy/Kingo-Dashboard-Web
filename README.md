# Kingo Dash Board Web API

{% swagger method="get" path="/" baseUrl="/api/userinfo" summary="" %}
{% swagger-description %}

{% endswagger-description %}

{% swagger-parameter in="query" required="true" %}

{% endswagger-parameter %}
{% endswagger %}

{% swagger method="get" path="/" baseUrl="/api/checkPointsFrom" summary="" %}
{% swagger-description %}

{% endswagger-description %}

{% swagger-parameter in="query" name="_from" required="true" %}

{% endswagger-parameter %}

{% swagger-parameter in="query" name="_type" required="true" %}

{% endswagger-parameter %}
{% endswagger %}

{% swagger method="post" path="/" baseUrl="/api/createTx " summary="" %}
{% swagger-description %}

{% endswagger-description %}

{% swagger-parameter in="body" name="_signedTransaction" required="true" %}

{% endswagger-parameter %}

{% swagger-parameter in="body" name="_point" required="true" %}

{% endswagger-parameter %}

{% swagger-parameter in="body" name="_to" required="true" %}

{% endswagger-parameter %}

{% swagger-parameter in="body" name="_from" required="true" %}

{% endswagger-parameter %}

{% swagger-response status="200: OK" description="" %}
```javascript
{
    // Response
}
```
{% endswagger-response %}
{% endswagger %}

{% swagger method="get" path="/" baseUrl="/api/getHash " summary="어떤 메타마스크 주소가 포함된 transaction에 대하여 어떤 _hash 값을 가지는지" %}
{% swagger-description %}

{% endswagger-description %}

{% swagger-parameter in="query" name="address" %}

{% endswagger-parameter %}
{% endswagger %}

{% swagger method="get" path="/" baseUrl="/api/uploadIpfs" summary="ipfs에 _hash가 특정값을 가지는 트랜잭션을 올림" %}
{% swagger-description %}
후에 node-schedule 코드로 바뀌어야함. _hash=null인 것에 대하여 ipfs에 업로드)
{% endswagger-description %}

{% swagger-parameter in="query" name="index" %}

{% endswagger-parameter %}

{% swagger-response status="200: OK" description="" %}
```javascript
{
    // Response
}
```
{% endswagger-response %}
{% endswagger %}
