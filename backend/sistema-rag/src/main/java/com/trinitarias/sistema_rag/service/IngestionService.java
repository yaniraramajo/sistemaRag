package com.trinitarias.sistema_rag.service;

import java.util.List;

import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Service;

import org.springframework.ai.document.Document;
import org.springframework.ai.reader.tika.TikaDocumentReader;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;

@Service
public class IngestionService {

    @Autowired
    private VectorStore vectorStore;

    @PostConstruct
    public void ingestDocuments() {
        try {
            System.out.println("***** INGESTION START *****");

            // Si ya hay datos, no re-indexar
            List<Document> existing = vectorStore.similaritySearch(
                SearchRequest.builder().query("colegio").topK(1).build()
            );
            if (!existing.isEmpty()) {
                System.out.println("Documentos ya indexados, omitiendo ingesta.");
                return;
            }

            PathMatchingResourcePatternResolver resolver =
                    new PathMatchingResourcePatternResolver();
            Resource[] resources =
                    resolver.getResources("classpath:documents/*");
            System.out.println("Documentos encontrados: " + resources.length);

            if (resources.length == 0) {
                System.out.println("No se encontraron documentos.");
                return;
            }

            TokenTextSplitter splitter = new TokenTextSplitter(1000, 200, 5, 10000, true);

            for (Resource resource : resources) {
                System.out.println("Indexando: " + resource.getFilename());
                TikaDocumentReader reader = new TikaDocumentReader(resource);
                List<Document> docs = reader.get();
                List<Document> chunks = splitter.apply(docs);
                vectorStore.add(chunks);
                System.out.println("Indexado: " + resource.getFilename());
            }

            System.out.println("***** INDEXACION COMPLETADA *****");

        } catch (Exception e) {
            System.err.println("Error en ingesta: " + e.getMessage());
            e.printStackTrace();
        }
    }
}