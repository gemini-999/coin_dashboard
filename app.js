
async function fetchCandleData() {
    const url = 'https://api.upbit.com/v1/candles/days?market=KRW-BTC&count=30';
    const response = await fetch(url);
    const data = await response.json();
    return data.map(candle => ({
        x: new Date(candle.candle_date_time_kst),
        y: [candle.opening_price, candle.high_price, candle.low_price, candle.trade_price],
        color: candle.opening_price < candle.trade_price ? "red" : "blue",  // 상승은 빨간색, 하락은 파란색
        risingColor: "red",  // 가격 상승 색상
        fallingColor: "blue" // 가격 하락 색상
    }));
}

window.onload = async function() {
    const candleData = await fetchCandleData();
    const options = {
        theme: "light2",
        title: {
            text: "비트코인 30일 캔들 차트"
        },
        axisY: {
            title: "가격 (KRW)",
        },
        data: [{
            type: "candlestick",
            showInLegend: true,
            name: "비트코인 가격",
            yValueFormatString: "###0.00 KRW",
            dataPoints: candleData
        }]
    };
    const chart = new CanvasJS.Chart("chartContainer", options);
    chart.render();
};
