using System.Collections.Generic;
using Test.Entities.Models;

namespace Test.Entities.ViewModel
{
    public class TradePaging
    {
        public int TotalPage { get; set; }
        public List<Trade> Data { get; set; }
    }
}