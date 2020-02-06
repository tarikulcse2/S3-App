using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Test.Entities.DBContext;
using Test.Entities.Models;
using Test.Service;
using Test.WebApi.ViewModel;

namespace Test.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TradeController : ControllerBase
    {
        private readonly ITradeService _tradeService;
        private IHostingEnvironment _hostingEnvironment;
        public TradeController(ITradeService tradeService, IHostingEnvironment hostingEnvironment)
        {
            _tradeService = tradeService;
            _hostingEnvironment = hostingEnvironment;
        }

        [HttpGet]
        public ActionResult Get(int page = 1, int size = 10, int tradeId = 0, int level = 0)
        {
            return Ok(_tradeService.GetAll(page, size, tradeId, level));
        }

        [HttpPost]
        public async Task<IActionResult> PostAsync([FromForm] TradeViewModel formData)
        {
            try
            {
                Trade trade = JsonConvert.DeserializeObject<Trade>(formData.Model);
                trade.EntyDate = DateTime.Now;
                trade.UpdateDate = DateTime.Now;
                var uploads = Path.Combine(_hostingEnvironment.WebRootPath, "uploads");
                if (!Directory.Exists(uploads))
                {
                    Directory.CreateDirectory(uploads);
                }
                trade.SyllbusFileName = formData.syllabussfile?.FileName;
                var filePath = Path.Combine(uploads, formData.syllabussfile?.FileName);
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await formData.syllabussfile.CopyToAsync(fileStream);
                }
                trade.PlanFileName = formData.planfile?.FileName;
                var filePath2 = Path.Combine(uploads, trade.PlanFileName);
                using (var fileStream = new FileStream(filePath2, FileMode.Create))
                {
                    await formData.planfile.CopyToAsync(fileStream);
                }
                if (_tradeService.Insert(trade)) return Ok(trade);
            }
            catch (System.Exception e)
            {

                throw e;
            }
            return Ok(null);
        }

        [HttpPut]
        public async Task<IActionResult> PutAsync([FromForm] TradeViewModel formData)
        {
            try
            {
                Trade trade = JsonConvert.DeserializeObject<Trade>(formData.Model);
                trade.UpdateDate = DateTime.Now;
                var uploads = Path.Combine(_hostingEnvironment.WebRootPath, "uploads");
                if (!Directory.Exists(uploads))
                {
                    Directory.CreateDirectory(uploads);
                }
                if (formData.syllabussfile != null)
                {
                    trade.SyllbusFileName = formData.syllabussfile?.FileName;
                    var filePath = Path.Combine(uploads, trade.PlanFileName);
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await formData.syllabussfile.CopyToAsync(fileStream);
                    }
                }

                if (formData.planfile != null)
                {
                    trade.PlanFileName = formData.planfile?.FileName;
                    var filePath2 = Path.Combine(uploads, trade.PlanFileName);
                    using (var fileStream = new FileStream(filePath2, FileMode.Create))
                    {
                        await formData.planfile.CopyToAsync(fileStream);
                    }
                }
                if (_tradeService.Update(trade)) return Ok(trade);
            }
            catch (System.Exception e)
            {

                throw e;
            }

            return Ok(null);
        }

        [HttpGet("FileDownload")]
        public async Task<ActionResult> FileDownloadAsync([FromQuery] string fileName)
        {
            var uploads = Path.Combine(_hostingEnvironment.WebRootPath, "uploads");
            var filePath = Path.Combine(uploads, fileName);
            if (!System.IO.File.Exists(filePath))
                return NotFound();
                
            var memory = new MemoryStream();
            using (var stream = new FileStream(filePath, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;

            //return File(new FileStream(filePath, FileMode.Open), "image/jpeg"); 

            return File(memory, GetContentType(filePath), fileName);
        }

        private string GetContentType(string path)
        {
            var provider = new FileExtensionContentTypeProvider();
            string contentType;
            if (!provider.TryGetContentType(path, out contentType))
            {
                contentType = "application/octet-stream";
            }
            return contentType;
        }
    }
}
