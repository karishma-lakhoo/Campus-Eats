export class CreditProcessor{

    calculateTotal(foodList){
        var total = 0;
        if(foodList.length == 0) return 0;
        total = foodList.reduce((sum, food) => {
            if (food) {
                const price = this.priceProcessor(food.price);
                return sum + price;
            }
            return sum;
          }, 0);
        return total;
    }

    priceProcessor(price){
        price = price.trim().replace(/[Rr]/g, '');
        return parseFloat(price);
    }
}