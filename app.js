async function fetchCandleData() {
    const url = 'https://api.upbit.com/v1/candles/days?market=KRW-BTC&count=50'; // 50일 데이터 필요 (가장 긴 이동 평균선 계산)
    const response = await fetch(url);
    const data = await response.json();
    return data.map(candle => ({
        x: new Date(candle.candle_date_time_kst),
        y: [candle.opening_price, candle.high_price, candle.low_price, candle.trade_price],
        color: (candle.opening_price < candle.trade_price) ? "red" : "blue"
    }));
}

function calculateMovingAverage(data, count) {
    let result = [];
    for (let i = count - 1; i < data.length; i++) {
        let sum = 0;
        for (let j = 0; j < count; j++) {
            sum += data[i - j].y[3]; // 종가 기준
        }
        result.push({
            x: data[i].x,
            y: sum / count
        });
    }
    return result;
}

window.onload = async function() {
    const candleData = await fetchCandleData();
    const ma7 = calculateMovingAverage(candleData, 7);
    const ma15 = calculateMovingAverage(candleData, 15);
    const ma50 = calculateMovingAverage(candleData, 50);

    const options = {
        theme: "light2",
        title: {
            text: "비트코인 30일 캔들 차트"
        },
        axisY: {
            title: "가격 (KRW)",
        },
        data: [
            {
                type: "candlestick",
                showInLegend: true,
                name: "캔들",
                dataPoints: candleData
            },
            {
                type: "line",
                showInLegend: true,
                name: "7일 이동 평균선",
                dataPoints: ma7,
                lineColor: "purple",
                markerType: "none"  // 점 표시 없음
            },
            {
                type: "line",
                showInLegend: true,
                name: "15일 이동 평균선",
                dataPoints: ma15,
                lineColor: "green",
                markerType: "none"  // 점 표시 없음
            },
            {
                type: "line",
                showInLegend: true,
                name: "50일 이동 평균선",
                dataPoints: ma50,
                lineColor: "orange",
                markerType: "none"  // 점 표시 없음
            }
        ]
    };
    const chart = new CanvasJS.Chart("chartContainer", options);
    chart.render();
};
