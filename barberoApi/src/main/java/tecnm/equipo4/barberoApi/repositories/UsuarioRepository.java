package tecnm.equipo4.barberoApi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import tecnm.equipo4.barberoApi.models.Usuario;

public interface UsuarioRepository extends CrudRepository<Usuario, Long> {
    Optional<Usuario> findByEmailAndPassword(String email, String password);
}