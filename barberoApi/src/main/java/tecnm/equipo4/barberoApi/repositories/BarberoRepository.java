package tecnm.equipo4.barberoApi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import tecnm.equipo4.barberoApi.models.Barbero;

@Repository
public interface BarberoRepository extends JpaRepository<Barbero, Long> {

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO barbero (id_barbero, id_usuario, experiencia, titulo_rol) VALUES (:id, :id, :experiencia, :tituloRol) ON DUPLICATE KEY UPDATE id_usuario = :id, experiencia = :experiencia, titulo_rol = :tituloRol", nativeQuery = true)
    void registrarOActualizarBarbero(@Param("id") Long id, 
                                     @Param("experiencia") Integer experiencia, 
                                     @Param("tituloRol") String tituloRol);
}