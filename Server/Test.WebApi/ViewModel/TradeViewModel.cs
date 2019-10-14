using System.Collections.Generic;
using Microsoft.AspNetCore.Http;

namespace Test.WebApi.ViewModel
{
    public class TradeViewModel
    {
        public IFormFile syllabussfile { get; set; }
        public IFormFile planfile { get; set; }
        public string Model { get; set; }
    }
}